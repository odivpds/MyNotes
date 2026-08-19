const { app, BrowserWindow, shell } = require('electron')
const path = require('path')
const fs = require('fs')

const BASE_URL = 'https://nopepads.vercel.app'
const ICON_PATH = path.join(__dirname, 'public', 'nopePadsLogo2d.png')

let mainWindow = null
const noteWindows = new Map() // noteId -> BrowserWindow

// ============================================
// Session Persistence
// ============================================
function getSessionPath() {
  return path.join(app.getPath('userData'), 'session.json')
}

function saveSession() {
  try {
    const session = {
      openNotes: [...noteWindows.keys()],
      mainWindowOpen: mainWindow !== null && !mainWindow.isDestroyed(),
    }
    fs.writeFileSync(getSessionPath(), JSON.stringify(session, null, 2))
  } catch (err) {
    console.error('Failed to save session:', err)
  }
}

function loadSession() {
  try {
    const data = fs.readFileSync(getSessionPath(), 'utf-8')
    return JSON.parse(data)
  } catch {
    return { openNotes: [], mainWindowOpen: true }
  }
}

// ============================================
// Main Window (Notes Grid / List)
// ============================================
function createMainWindow() {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.focus()
    return mainWindow
  }

  mainWindow = new BrowserWindow({
    width: 420,
    height: 650,
    minWidth: 320,
    minHeight: 400,
    title: 'NOPEPADS',
    icon: ICON_PATH,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  })

  mainWindow.loadURL(`${BASE_URL}/notes`)

  // Intercept navigation: if user clicks a note link (/notes/{id}), open in floating window
  mainWindow.webContents.on('will-navigate', (event, url) => {
    const noteMatch = url.match(/\/notes\/([a-f0-9-]+)$/i)
    if (noteMatch) {
      event.preventDefault()
      createNoteWindow(noteMatch[1])
    }
  })

  // Intercept window.open() calls from the web app
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    const noteMatch = url.match(/\/notes\/([a-f0-9-]+)$/i)
    if (noteMatch) {
      createNoteWindow(noteMatch[1])
      return { action: 'deny' }
    }
    if (!url.startsWith(BASE_URL)) {
      shell.openExternal(url)
      return { action: 'deny' }
    }
    return { action: 'allow' }
  })

  mainWindow.on('closed', () => {
    mainWindow = null
    saveSession()
  })

  return mainWindow
}

// ============================================
// Floating Note Window (Sticky Note style)
// ============================================
function createNoteWindow(noteId) {
  // If this note is already open, focus it
  if (noteWindows.has(noteId)) {
    const existingWin = noteWindows.get(noteId)
    if (!existingWin.isDestroyed()) {
      existingWin.focus()
      return existingWin
    }
    noteWindows.delete(noteId)
  }

  // Stagger window positions so they don't all stack on top of each other
  const offset = noteWindows.size * 30

  const noteWin = new BrowserWindow({
    width: 400,
    height: 500,
    minWidth: 300,
    minHeight: 350,
    x: 200 + offset,
    y: 150 + offset,
    title: 'NOPEPADS',
    icon: ICON_PATH,
    autoHideMenuBar: true,
    frame: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  })

  noteWin.loadURL(`${BASE_URL}/notes/${noteId}`)

  // Intercept navigation within the note window
  noteWin.webContents.on('will-navigate', (event, url) => {
    // If navigating to notes list, open/focus main window instead
    if (url === `${BASE_URL}/notes` || url === `${BASE_URL}/notes/`) {
      event.preventDefault()
      createMainWindow()
      return
    }
    // If navigating to another note, open that in a new window
    const noteMatch = url.match(/\/notes\/([a-f0-9-]+)$/i)
    if (noteMatch && noteMatch[1] !== noteId) {
      event.preventDefault()
      createNoteWindow(noteMatch[1])
      return
    }
  })

  // Intercept window.open() calls
  noteWin.webContents.setWindowOpenHandler(({ url }) => {
    const noteMatch = url.match(/\/notes\/([a-f0-9-]+)$/i)
    if (noteMatch) {
      createNoteWindow(noteMatch[1])
      return { action: 'deny' }
    }
    if (url === `${BASE_URL}/notes` || url === `${BASE_URL}/notes/`) {
      createMainWindow()
      return { action: 'deny' }
    }
    if (!url.startsWith(BASE_URL)) {
      shell.openExternal(url)
      return { action: 'deny' }
    }
    return { action: 'allow' }
  })

  noteWin.on('closed', () => {
    noteWindows.delete(noteId)
    saveSession()
    // If no windows are open at all, quit (Windows behavior)
    if ((!mainWindow || mainWindow.isDestroyed()) && noteWindows.size === 0) {
      if (process.platform !== 'darwin') app.quit()
    }
  })

  noteWindows.set(noteId, noteWin)
  saveSession()
  return noteWin
}

// ============================================
// App Lifecycle
// ============================================
app.whenReady().then(() => {
  const session = loadSession()

  if (session.openNotes && session.openNotes.length > 0) {
    // Restore previously open note windows
    session.openNotes.forEach(noteId => {
      createNoteWindow(noteId)
    })
    // Also open main window if it was open before
    if (session.mainWindowOpen) {
      createMainWindow()
    }
  } else {
    // First launch or no saved session — open main window
    createMainWindow()
  }

  app.on('activate', () => {
    // macOS: re-create window when dock icon is clicked
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

