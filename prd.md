# PRD — Neobrutalist Personal Notepad

## 1. Project Overview

Build a personal note-taking web application inspired by the simplicity and usability of Google Keep / Sticky Notes, but with a distinctive **Neobrutalism visual identity** and a highly customizable theme system.

The application is primarily intended as a personal project and portfolio project.

The core experience should be:

> Open the app → quickly create a note → type → changes are automatically saved → organize/search notes → customize the appearance.

The application should feel fast, playful, tactile, and intentionally designed rather than looking like a generic CRUD dashboard.

---

# 2. Product Goals

## Primary Goals

1. Create notes quickly.
2. Edit notes with a pleasant writing experience.
3. Automatically save changes.
4. Organize notes using colors, tags, pinning, and archiving.
5. Search notes quickly.
6. Provide responsive desktop and mobile experiences.
7. Establish a reusable design system based on Neobrutalism.
8. Make the entire visual system themeable.
9. Keep the architecture simple enough for a personal project.
10. Produce clean, maintainable, production-quality code.

## Secondary Goals

* Support rich text.
* Support dark mode.
* Support custom themes.
* Prepare the architecture for future realtime synchronization.
* Prepare the architecture for future offline/PWA support.
* Make the project suitable for a public GitHub portfolio.

---

# 3. Non-Goals

Do NOT attempt to replicate all features of Google Keep, Notion, or Evernote.

The first version should NOT include:

* collaborative editing
* team/workspace functionality
* complex permissions
* enterprise features
* AI note generation
* calendar integration
* email integration
* complicated file management
* microservices architecture
* Elasticsearch/OpenSearch
* event-driven architecture
* Kubernetes
* unnecessary abstractions

Prefer a simple monolithic architecture.

---

# 4. Target User

Primary user:

> A single individual who wants a fast personal notepad with a distinctive customizable interface.

The UX should prioritize:

* speed
* simplicity
* keyboard usage
* visual clarity
* low friction
* responsive behavior

---

# 5. Core User Experience

The main screen should resemble a modern sticky-note board.

Example:

```text
┌─────────────────────────────────────────────────────┐
│ MY NOTES                           + NEW NOTE        │
├───────────────┬─────────────────────────────────────┤
│               │                                     │
│  All Notes    │  ┌──────────────┐ ┌──────────────┐ │
│  Pinned       │  │ TODO         │ │ PROJECT      │ │
│  Archive      │  │              │ │              │ │
│               │  │ Buy milk     │ │ Build app    │ │
│  Tags         │  │ Learn Rust   │ │              │ │
│  #work        │  │              │ │ #development │ │
│  #personal    │  └──────────────┘ └──────────────┘ │
│               │                                     │
│               │  ┌──────────────┐ ┌──────────────┐ │
│               │  │ IDEA         │ │ RANDOM       │ │
│               │  │              │ │              │ │
│               │  │ Portfolio    │ │ Something    │ │
│               │  │ redesign     │ │ interesting  │ │
│               │  └──────────────┘ └──────────────┘ │
│               │                                     │
└───────────────┴─────────────────────────────────────┘
```

This is only a conceptual layout. Do not copy it literally if a better UX is discovered during implementation.

---

# 6. Technology Stack

Use the following stack unless there is a strong technical reason to change it.

## Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS
* shadcn/ui

## Editor

* Tiptap

Use Tiptap for rich-text editing.

The editor should support at minimum:

* paragraph
* heading
* bold
* italic
* strike
* bullet list
* ordered list
* checklist
* links
* code
* blockquote

Avoid implementing a custom rich-text editor.

## Backend

Use Next.js as the application backend.

Prefer:

* Server Actions
* Route Handlers
* Server Components where appropriate

Do not create a separate Express/NestJS backend unless there is a compelling reason.

## Database

* PostgreSQL

Preferred managed provider:

* Supabase

## Authentication

* Supabase Auth

Support Google authentication if practical.

Email/password authentication may also be supported.

## Validation

* Zod

All important server-side input should be validated.

## ORM / Database Access

Preferred:

* Drizzle ORM

However, direct Supabase queries are acceptable where they result in simpler and clearer code.

Do not introduce both Drizzle and another ORM unnecessarily.

## Deployment

* Vercel for application
* Supabase for PostgreSQL/Auth/Storage

---

# 7. Architecture Principles

Follow these principles:

### Keep it simple

This is a personal application.

Prefer:

```text
Next.js
    ↓
Server Actions / Route Handlers
    ↓
PostgreSQL
```

instead of:

```text
Frontend
    ↓
API Gateway
    ↓
Backend Service
    ↓
Message Queue
    ↓
Microservices
    ↓
Database
```

### Separation of concerns

Separate:

* UI
* business logic
* database access
* validation
* authentication
* theme system

Do not put large amounts of business logic inside React components.

### Reusable components

Create reusable components for:

* NoteCard
* NoteEditor
* NoteGrid
* NoteToolbar
* SearchBar
* Sidebar
* TagBadge
* ColorPicker
* ThemeEditor
* ThemePreview

---

# 8. Database Schema

Initial schema:

## users

```text
id
email
created_at
```

Authentication users may be managed by Supabase Auth.

## notes

```text
id
user_id
title
content
color
is_pinned
is_archived
is_deleted
created_at
updated_at
```

Suggested types:

```text
id           UUID
user_id      UUID
title        TEXT
content      JSONB
color        TEXT
is_pinned    BOOLEAN
is_archived  BOOLEAN
is_deleted   BOOLEAN
created_at   TIMESTAMP
updated_at   TIMESTAMP
```

`content` should store the Tiptap document JSON.

## tags

```text
id
user_id
name
created_at
```

## note_tags

```text
note_id
tag_id
```

## themes

```text
id
user_id
name
config
created_at
updated_at
```

`config` should use JSONB.

Example:

```json
{
  "background": "#F5F5F0",
  "foreground": "#000000",
  "primary": "#FFDE59",
  "secondary": "#FF6B6B",
  "accent": "#7BDFF2",
  "borderWidth": "3px",
  "borderRadius": "8px",
  "shadowOffset": "6px"
}
```

---

# 9. Note Features

## Create Note

User can create a note from:

* New Note button
* keyboard shortcut
* mobile floating action button

A newly created note should immediately be editable.

---

## Edit Note

User can edit:

* title
* content
* color
* tags

Changes should be automatically persisted.

---

## Auto Save

Implement debounced auto-save.

Expected behavior:

```text
User types
    ↓
debounce
    ↓
save
    ↓
database
    ↓
"Saved" indicator
```

Suggested debounce:

```text
500–1000ms
```

Do not send a database request on every keystroke.

The UI should communicate state:

```text
Saving...
Saved
```

If saving fails:

```text
Failed to save
Retry
```

Never silently discard user input.

---

# 10. Delete

Deleting a note should preferably use soft delete.

Example:

```text
is_deleted = true
```

Deleted notes can later be permanently removed.

MVP should support:

* delete
* restore

Permanent deletion can be implemented later.

---

# 11. Pinning

Users can pin important notes.

Pinned notes should appear before normal notes.

Example:

```text
Pinned
────────────
Note A
Note B

Others
────────────
Note C
Note D
```

---

# 12. Archive

Archived notes should disappear from the main notes view.

They should remain accessible from:

```text
Archive
```

Archive should not delete the note.

---

# 13. Tags

Users can add multiple tags.

Example:

```text
#work
#personal
#ideas
#development
#shopping
```

Tags should be reusable across notes.

The sidebar should allow filtering by tag.

---

# 14. Search

Search should support:

* title
* content
* tags

Initial implementation can use PostgreSQL search capabilities.

Do not introduce Elasticsearch.

Search should feel instantaneous for normal personal-note datasets.

Potential UX:

```text
⌘ K

Search notes...
```

On Windows/Linux:

```text
Ctrl + K
```

---

# 15. Note Colors

Each note may have its own color.

Initial palette:

```text
Default
Yellow
Pink
Blue
Green
Purple
Orange
```

Colors must come from design tokens rather than hardcoded component-specific styling.

---

# 16. Theme System

Theme customization is a major feature of the application.

The UI should NOT hardcode visual values everywhere.

Use CSS variables/design tokens.

Example:

```css
--background
--foreground
--surface
--primary
--secondary
--accent
--border
--shadow
--radius
```

Components should consume these variables.

Bad:

```tsx
bg-[#FFDE59]
```

Preferred:

```tsx
bg-primary
```

or equivalent theme token.

---

# 17. Default Theme: Neobrutalism

The default theme must be Neobrutalist.

Characteristics:

* strong black borders
* hard offset shadows
* bold typography
* bright/pastel colors
* tactile cards
* strong visual hierarchy
* minimal gradients
* minimal glassmorphism
* minimal blur
* intentionally imperfect/playful appearance

Example conceptual styling:

```css
border: 3px solid black;
box-shadow: 6px 6px 0 black;
border-radius: 8px;
```

Buttons should feel tactile.

Example interaction:

```text
Default
┌─────────────┐
│ NEW NOTE    │
└─────────────┘
      █████

Hover
 ┌─────────────┐
 │ NEW NOTE    │
 └─────────────┘
     █████

Active
   ┌─────────────┐
   │ NEW NOTE    │
   └─────────────┘
```

Use transforms/shadow changes to communicate physical interaction.

---

# 18. Theme Editor

Provide a settings page where users can customize the theme.

Theme editor should support at minimum:

* background color
* foreground color
* primary color
* secondary color
* accent color
* border width
* border radius
* shadow size

Example:

```text
THEME EDITOR

Background    [ #F5F5F0 ]
Primary       [ #FFDE59 ]
Secondary     [ #FF6B6B ]
Accent        [ #7BDFF2 ]

Border Width  [ 3px ]
Radius        [ 8px ]
Shadow        [ 6px ]

[ SAVE THEME ]
```

Include a live preview.

Changes should be visible immediately before saving.

---

# 19. Theme Architecture

Themes should be data-driven.

Example:

```text
themes/
├── neobrutalism
├── minimal
├── dark
└── custom
```

Do not create separate components for each theme.

The same components should work across themes.

Example:

```text
NoteCard
    ↓
design tokens
    ↓
current theme
```

not:

```text
NeoBrutalismNoteCard
MinimalNoteCard
DarkNoteCard
```

---

# 20. Responsive Design

The application must work well on:

* desktop
* tablet
* mobile

Desktop:

```text
Sidebar + Note Grid
```

Mobile:

```text
Top bar
↓
Notes
↓
Floating New Note button
```

The sidebar can become a drawer/sheet on mobile.

Do not simply shrink the desktop layout.

Design mobile interaction intentionally.

---

# 21. Main Pages

## `/`

Redirect based on authentication state.

Unauthenticated:

```text
/login
```

Authenticated:

```text
/notes
```

---

## `/login`

Authentication screen.

Keep it simple.

---

## `/notes`

Main application.

Contains:

* sidebar
* search
* note grid
* filters
* create note
* pinned section
* normal notes

---

## `/notes/[id]`

Note editing page or modal route.

Should support:

* title
* editor
* tags
* color
* pin
* archive
* delete

---

## `/archive`

Archived notes.

---

## `/trash`

Deleted notes.

---

## `/settings`

Settings.

Sections:

```text
Account
Appearance
Themes
Keyboard Shortcuts
```

---

# 22. UI Components

Create reusable components.

Suggested structure:

```text
components/

ui/
    Button
    Dialog
    Dropdown
    Input
    Tooltip
    Sheet

layout/
    AppShell
    Sidebar
    Header
    MobileNav

notes/
    NoteCard
    NoteGrid
    NoteEditor
    NoteToolbar
    NoteColorPicker
    NoteActions
    NoteListEmptyState

search/
    SearchBar
    SearchCommand

tags/
    TagBadge
    TagPicker
    TagList

themes/
    ThemeEditor
    ThemePreview
    ThemeSelector
```

Component names may change if a better architecture is found.

---

# 23. State Management

Avoid global state unless necessary.

Prefer:

```text
Server state
    ↓
Server Components / Server Actions
```

Use local React state for:

* editor state
* dialogs
* menus
* temporary UI state

Only introduce Zustand or another global state library if there is a demonstrated need.

Do not use global state just because it is available.

---

# 24. Error Handling

Every mutation should handle failure.

Examples:

```text
Create note failed
Update note failed
Delete note failed
Save theme failed
```

The UI should provide feedback.

Use:

* toast
* inline error
* retry action

depending on context.

Never swallow errors silently.

---

# 25. Loading States

Use skeletons where appropriate.

Avoid excessive spinners.

The UI should feel fast.

For note cards:

```text
┌───────────────┐
│ ███████████   │
│               │
│ █████████     │
│ ███████       │
└───────────────┘
```

---

# 26. Empty States

Design intentional empty states.

Example:

```text
┌───────────────────────────┐
│                           │
│       NO NOTES YET        │
│                           │
│   Your brain is empty.    │
│   Let's fix that.         │
│                           │
│      [ + NEW NOTE ]       │
│                           │
└───────────────────────────┘
```

Keep the tone playful but not excessive.

---

# 27. Keyboard Shortcuts

Implement common shortcuts.

At minimum:

```text
Ctrl/Cmd + K
    Search

Ctrl/Cmd + N
    New note

Ctrl/Cmd + Enter
    Save/finish editing if applicable

Escape
    Close modal/editor
```

Do not override browser/system shortcuts unnecessarily.

---

# 28. Accessibility

The application must be accessible.

Requirements:

* semantic HTML
* keyboard navigation
* visible focus states
* accessible buttons
* aria labels where necessary
* sufficient color contrast
* dialogs should trap focus
* do not rely only on color to communicate state

Neobrutalism should not compromise accessibility.

---

# 29. Performance

Prioritize:

* fast initial page load
* minimal client-side JavaScript
* server components where appropriate
* debounced mutations
* optimized database queries
* pagination/infinite scrolling if needed later

Do not prematurely optimize.

---

# 30. Security

Every note query must be scoped to the authenticated user.

Example conceptual rule:

```text
user_id === authenticatedUser.id
```

Never trust `user_id` supplied by the client.

Validate all server inputs.

Never expose service-role secrets to the browser.

Use environment variables for secrets.

---

# 31. Environment Variables

Expected variables may include:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
DATABASE_URL
```

Only expose variables prefixed with:

```text
NEXT_PUBLIC_
```

when they are genuinely safe for the client.

Never expose service-role credentials.

---

# 32. Development Principles

When implementing this project:

1. Do not over-engineer.
2. Prefer boring solutions.
3. Prefer readable code over clever code.
4. Keep components small.
5. Avoid premature abstractions.
6. Avoid unnecessary dependencies.
7. Keep the database schema normalized.
8. Keep UI design consistent.
9. Use TypeScript strictly.
10. Validate data at the server boundary.
11. Handle errors explicitly.
12. Keep the application responsive.
13. Build features incrementally.
14. Do not implement future features unless required by the current milestone.

---

# 33. MVP Scope

The first working version MUST contain:

### Authentication

* [ ] Login
* [ ] Logout
* [ ] Protected application routes

### Notes

* [ ] Create note
* [ ] Edit note
* [ ] Delete note
* [ ] Restore note
* [ ] Pin note
* [ ] Archive note
* [ ] Change note color
* [ ] Auto-save

### Organization

* [ ] Tags
* [ ] Search
* [ ] Pinned section
* [ ] Archive
* [ ] Trash

### Editor

* [ ] Rich text
* [ ] Bold
* [ ] Italic
* [ ] Headings
* [ ] Lists
* [ ] Checklist
* [ ] Links

### UI

* [ ] Neobrutalism theme
* [ ] Responsive layout
* [ ] Mobile layout
* [ ] Dark mode
* [ ] Loading states
* [ ] Empty states
* [ ] Error states

### Theme

* [ ] CSS design tokens
* [ ] Theme selector
* [ ] Theme editor
* [ ] Live theme preview
* [ ] Save custom theme

---

# 34. Post-MVP Features

Do not implement these until MVP is stable.

Potential future features:

```text
- [ ] PWA
- [ ] Offline mode
- [ ] Realtime sync
- [ ] Attachments
- [ ] Image uploads
- [ ] Markdown import/export
- [ ] JSON backup
- [ ] Note duplication
- [ ] Drag-and-drop note ordering
- [ ] Custom fonts
- [ ] More advanced theme editor
- [ ] Theme sharing
- [ ] Public/shared notes
- [ ] Keyboard shortcut customization
```

---

# 35. Suggested Implementation Order

Build incrementally.

## Phase 1 — Foundation

* [ ] Initialize Next.js
* [ ] TypeScript
* [ ] Tailwind
* [ ] shadcn/ui
* [ ] Supabase
* [ ] Database connection
* [ ] Authentication
* [ ] Basic application shell

## Phase 2 — Notes

* [ ] Note database schema
* [ ] Create note
* [ ] Read notes
* [ ] Update note
* [ ] Delete note
* [ ] Note card
* [ ] Note grid

## Phase 3 — Editor

* [ ] Tiptap
* [ ] Rich text
* [ ] Auto-save
* [ ] Save status
* [ ] Error handling

## Phase 4 — Organization

* [ ] Pin
* [ ] Archive
* [ ] Trash
* [ ] Tags
* [ ] Search
* [ ] Note colors

## Phase 5 — Design System

* [ ] Neobrutalism tokens
* [ ] Buttons
* [ ] Cards
* [ ] Inputs
* [ ] Dialogs
* [ ] Navigation
* [ ] Responsive behavior
* [ ] Dark mode

## Phase 6 — Theme Engine

* [ ] Theme schema
* [ ] Theme selector
* [ ] Theme editor
* [ ] Live preview
* [ ] Save custom themes

## Phase 7 — Polish

* [ ] Accessibility
* [ ] Keyboard shortcuts
* [ ] Loading states
* [ ] Empty states
* [ ] Error states
* [ ] Performance
* [ ] Mobile UX
* [ ] Visual polish

---

# 36. Definition of Done

The MVP is considered complete when:

1. A user can authenticate.
2. A user can create a note.
3. A user can edit a note.
4. Notes are automatically saved.
5. Saved notes persist after refresh.
6. Users can delete and restore notes.
7. Users can pin and archive notes.
8. Users can add tags.
9. Users can search notes.
10. Users can change note colors.
11. The application works on mobile and desktop.
12. The default visual language is clearly Neobrutalist.
13. The UI uses design tokens instead of scattered hardcoded colors.
14. Users can create and save custom themes.
15. Authentication and database access are properly scoped to the current user.
16. Errors are handled visibly.
17. The application does not lose note content silently.
18. The codebase is understandable and maintainable.

---

# 37. Coding Agent Rules

When using an AI coding agent to implement this project, follow these rules.

### Rule 1

Read this `PRD.md` before making architectural decisions.

### Rule 2

Do not implement the entire application in one giant change.

Implement one milestone at a time.

### Rule 3

Before changing architecture, explain why the current architecture is insufficient.

### Rule 4

Do not introduce a dependency unless it solves a real problem.

### Rule 5

Do not replace existing technologies without a clear reason.

### Rule 6

Never remove working functionality to implement a new feature.

### Rule 7

When modifying database schema:

* update migration
* update types
* update queries
* verify affected features

### Rule 8

When implementing UI:

* follow the existing design tokens
* maintain Neobrutalist visual language
* maintain responsive behavior
* maintain accessibility

### Rule 9

When implementing a feature, also consider:

```text
loading
error
empty
success
mobile
desktop
keyboard
accessibility
```

### Rule 10

After each meaningful implementation step:

1. run type checking
2. run linting
3. run relevant tests
4. fix errors
5. summarize what changed

---

# 38. Coding Style

Use strict TypeScript.

Prefer:

```ts
type Note = {
  id: string;
  title: string;
  content: JSONValue;
};
```

Avoid:

```ts
const data: any = ...
```

Do not use `any` unless there is a very specific reason.

Prefer explicit types.

Prefer composition over inheritance.

Prefer functions over classes for normal application logic.

---

# 39. Visual Direction

The visual identity should feel like:

```text
playful
+
bold
+
tactile
+
minimal
+
personal
```

Avoid:

```text
generic SaaS dashboard
glassmorphism
excessive gradients
excessive rounded corners
generic blue/purple AI UI
overly polished corporate design
```

The application should look intentionally handmade while still feeling technically polished.

---

# 40. Final Product Vision

The final product should feel like:

> "A digital notebook that looks and behaves like a box of colorful sticky notes on my desk."

It should be:

* fast
* personal
* playful
* customizable
* responsive
* reliable
* visually distinctive

The Neobrutalism aesthetic is not merely decoration.

It should influence:

* cards
* buttons
* typography
* shadows
* interactions
* spacing
* colors
* theme system

However, usability always takes priority over visual styling.
