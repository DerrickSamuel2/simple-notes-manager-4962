import React from "react";
import { useNotes } from "../context/NotesContext";
import NoteListItem from "./NotesListItem";

// PUBLIC_INTERFACE
export default function NotesList() {
  /** Displays the list of notes with selection and delete actions. */
  const { notes, selectedId, selectNote, deleteNote, loading } = useNotes();

  if (!notes?.length && !loading) {
    return <div className="empty">No notes yet. Create your first note!</div>;
  }

  return (
    <div className="notes-list" role="list">
      {notes.map((n) => (
        <NoteListItem
          key={n.id}
          note={n}
          active={selectedId === n.id}
          onSelect={() => selectNote(n.id)}
          onDelete={() => deleteNote(n.id)}
        />
      ))}
    </div>
  );
}
