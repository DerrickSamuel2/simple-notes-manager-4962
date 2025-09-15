import React from "react";
import NotesList from "./NotesList";
import NoteEditor from "./NoteEditor";
import { useNotes } from "../context/NotesContext";

// PUBLIC_INTERFACE
export default function Layout() {
  /** Main two-column layout with notes list and editor. */
  const { createNote, loading, error } = useNotes();

  return (
    <main className="container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="subtitle">Your Notes</div>
          <button className="btn small" onClick={() => createNote({ title: "New note", content: "" })}>
            ➕ New
          </button>
        </div>
        {loading && <div className="loading">Loading…</div>}
        {error && <div className="error">Error: {error}</div>}
        <NotesList />
      </aside>
      <section className="content">
        <NoteEditor />
      </section>
    </main>
  );
}
