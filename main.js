const { app, BrowserWindow, shell } = require('electron')
const path = require('path')

let mainWindow

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    title: 'NOPEPADS',
    icon: path.join(__dirname, 'public', 'nopePadsLogo2d.png'),
    autoHideMenuBar: true, // Hide the default windows menu bar (File, Edit, etc)
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    }
  })

  // Load the Vercel deployed web app
  mainWindow.loadURL('https://nopepads.vercel.app')

  // Open any external links in the default browser instead of the app window
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (!url.startsWith('https://nopepads.vercel.app')) {
      shell.openExternal(url)
      return { action: 'deny' }
    }
    return { action: 'allow' }
  })
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  // Quit when all windows are closed, except on macOS
  if (process.platform !== 'darwin') app.quit()
})
