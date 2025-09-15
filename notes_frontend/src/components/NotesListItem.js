import React from "react";

// PUBLIC_INTERFACE
export default function NotesListItem({ note, active, onSelect, onDelete }) {
  /** Renders a single note item row. */
  const date = new Date(note.updatedAt).toLocaleString();
  return (
    <button
      className={`note-item ${active ? "active" : ""}`}
      onClick={onSelect}
      aria-pressed={active}
      role="listitem"
      title={`Last updated: ${date}`}
    >
      <div className="note-item-heading">
        <div className="note-title">{note.title || "Untitled"}</div>
        <button
          className="icon-btn danger"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          aria-label={`Delete note "${note.title || "Untitled"}"`}
          title="Delete"
        >
          🗑️
        </button>
      </div>
      <div className="note-snippet">{(note.content || "").slice(0, 80)}</div>
      <div className="note-meta">Updated {date}</div>
    </button>
  );
}
