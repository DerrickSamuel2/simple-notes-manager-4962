# Simple Notes Frontend (React)

A clean, lightweight React app to manage notes with Create, Read, Update, Delete features. Data is currently mocked and stored in `localStorage` to simulate API calls. The code is organized for a future backend integration.

## Features
- List notes with last-updated timestamp
- Create a new note
- Edit existing note (title and content)
- Delete a note
- Light/Dark theme toggle
- Responsive two-column layout
- Encapsulated data layer ready for backend swap

## Tech
- React 18, react-scripts
- Pure CSS (no UI frameworks)
- Context API for centralized state

## Structure
- `src/context/NotesContext.js`: central state + mocked API with localStorage
- `src/components/`: UI components (Header, Layout, NotesList, NotesListItem, NoteEditor)
- `src/App.js`: composition and theme handling
- `src/App.css`: styles and theming

## Development
- Install dependencies: `npm install`
- Start dev server: `npm start`
- Run tests: `npm test`
- Build: `npm run build`

## Backend Integration
Replace the functions in `NotesContext.js`:
- `apiListNotes()`
- `apiCreateNote(note)`
- `apiUpdateNote(note)`
- `apiDeleteNote(id)`

These are the only places that need to change to connect to a real backend. Keep the function signatures and return shapes consistent for minimal changes to the rest of the app.

## Accessibility
- Buttons include aria-labels where relevant
- Semantic roles for list and list items

Enjoy taking notes!
