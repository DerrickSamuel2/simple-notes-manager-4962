import React, { useEffect, useMemo, useState } from "react";
import { useNotes } from "../context/NotesContext";

// PUBLIC_INTERFACE
export default function NoteEditor() {
  /** Editor for the selected note; allows creating and updating notes. */
  const { notes, selectedId, createNote, updateNote } = useNotes();
  const selected = useMemo(() => notes.find((n) => n.id === selectedId), [notes, selectedId]);

  const [title, setTitle] = useState(selected?.title || "");
  const [content, setContent] = useState(selected?.content || "");
  const isNew = !selected;

  useEffect(() => {
    setTitle(selected?.title || "");
    setContent(selected?.content || "");
  }, [selectedId, selected]);

  const handleSave = async () => {
    if (isNew) {
      await createNote({ title: title.trim() || "Untitled", content });
    } else if (selected) {
      await updateNote({ ...selected, title: title.trim() || "Untitled", content });
    }
  };

  return (
    <div className="editor">
      <div className="editor-toolbar">
        <button className="btn" onClick={handleSave} title="Save note">
          💾 Save
        </button>
        <button
          className="btn outline"
          onClick={() => {
            setTitle("");
            setContent("");
          }}
          title="Clear editor"
        >
          🧹 Clear
        </button>
      </div>
      <input
        className="input title-input"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Note title"
        aria-label="Note title"
      />
      <textarea
        className="textarea content-input"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your note here..."
        aria-label="Note content"
      />
      <div className="hint">{isNew ? "Creating new note…" : "Editing existing note"}</div>
    </div>
  );
}
