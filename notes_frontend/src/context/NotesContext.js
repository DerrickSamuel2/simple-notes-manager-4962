import React, { createContext, useContext, useEffect, useMemo, useReducer } from "react";

/**
 * Notes data model
 * id: string
 * title: string
 * content: string
 * updatedAt: number (epoch ms)
 */

// Internal utilities
const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

// Mock API layer: encapsulates all data operations to allow future backend swap
const mockDelay = (ms = 200) => new Promise((res) => setTimeout(res, ms));
const STORAGE_KEY = "notes_frontend_notes";

// Load initial notes from localStorage or defaults
function loadInitialNotes() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    // ignore parse errors and fall back to defaults
  }
  return [
    {
      id: uid(),
      title: "Welcome to Notes",
      content:
        "This is your first note. You can create, edit, and delete notes. Everything is stored locally for now.",
      updatedAt: Date.now(),
    },
    {
      id: uid(),
      title: "Tips",
      content:
        "Click a note to edit it. Use the New Note button to create a fresh one. Delete with the trash icon.",
      updatedAt: Date.now(),
    },
  ];
}

async function apiListNotes() {
  await mockDelay();
  return loadInitialNotes();
}

async function apiCreateNote(note) {
  await mockDelay();
  const notes = loadInitialNotes();
  const newNote = {
    id: uid(),
    title: note.title || "Untitled",
    content: note.content || "",
    updatedAt: Date.now(),
  };
  const updated = [newNote, ...notes];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return newNote;
}

async function apiUpdateNote(note) {
  await mockDelay();
  const notes = loadInitialNotes();
  const updated = notes.map((n) => (n.id === note.id ? { ...n, ...note, updatedAt: Date.now() } : n));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated.find((n) => n.id === note.id);
}

async function apiDeleteNote(id) {
  await mockDelay();
  const notes = loadInitialNotes();
  const updated = notes.filter((n) => n.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return true;
}

// Context and reducer
const NotesContext = createContext(null);

const initialState = {
  notes: [],
  loading: false,
  error: null,
  selectedId: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, loading: true, error: null };
    case "error":
      return { ...state, loading: false, error: action.error || "Unknown error" };
    case "setNotes":
      return { ...state, loading: false, error: null, notes: action.notes };
    case "select":
      return { ...state, selectedId: action.id };
    case "addNote":
      return { ...state, notes: [action.note, ...state.notes], selectedId: action.note.id };
    case "updateNote":
      return {
        ...state,
        notes: state.notes.map((n) => (n.id === action.note.id ? action.note : n)),
      };
    case "deleteNote":
      return {
        ...state,
        notes: state.notes.filter((n) => n.id !== action.id),
        selectedId: state.selectedId === action.id ? null : state.selectedId,
      };
    default:
      return state;
  }
}

// PUBLIC_INTERFACE
export function NotesProvider({ children }) {
  /** Provides notes state and CRUD operations to children. Mocked with localStorage, ready for backend swap. */
  const [state, dispatch] = useReducer(reducer, initialState);

  // Initial load
  useEffect(() => {
    let ignore = false;
    (async () => {
      dispatch({ type: "loading" });
      try {
        const notes = await apiListNotes();
        if (!ignore) dispatch({ type: "setNotes", notes });
      } catch (e) {
        if (!ignore) dispatch({ type: "error", error: e?.message || String(e) });
      }
    })();
    return () => {
      ignore = true;
    };
  }, []);

  // PUBLIC_INTERFACE
  const selectNote = (id) => dispatch({ type: "select", id });

  // PUBLIC_INTERFACE
  const createNote = async (payload = {}) => {
    dispatch({ type: "loading" });
    try {
      const created = await apiCreateNote(payload);
      dispatch({ type: "addNote", note: created });
      return created;
    } catch (e) {
      dispatch({ type: "error", error: e?.message || String(e) });
      throw e;
    }
  };

  // PUBLIC_INTERFACE
  const updateNote = async (payload) => {
    dispatch({ type: "loading" });
    try {
      const updated = await apiUpdateNote(payload);
      dispatch({ type: "updateNote", note: updated });
      return updated;
    } catch (e) {
      dispatch({ type: "error", error: e?.message || String(e) });
      throw e;
    }
  };

  // PUBLIC_INTERFACE
  const deleteNote = async (id) => {
    dispatch({ type: "loading" });
    try {
      await apiDeleteNote(id);
      dispatch({ type: "deleteNote", id });
      return true;
    } catch (e) {
      dispatch({ type: "error", error: e?.message || String(e) });
      throw e;
    }
  };

  const value = useMemo(
    () => ({
      notes: state.notes,
      loading: state.loading,
      error: state.error,
      selectedId: state.selectedId,
      selectNote,
      createNote,
      updateNote,
      deleteNote,
    }),
    [state.notes, state.loading, state.error, state.selectedId]
  );

  return <NotesContext.Provider value={value}>{children}</NotesContext.Provider>;
}

// PUBLIC_INTERFACE
export function useNotes() {
  /** Hook to access notes context. */
  const ctx = useContext(NotesContext);
  if (!ctx) {
    throw new Error("useNotes must be used within a NotesProvider");
  }
  return ctx;
}
