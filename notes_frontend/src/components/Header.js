import React from "react";

// PUBLIC_INTERFACE
export default function Header({ theme, onToggleTheme }) {
  /** Header with app title and theme toggle. */
  return (
    <header className="navbar">
      <div className="brand">
        <span className="logo">🗒️</span>
        <span className="title">Simple Notes</span>
      </div>
      <div className="actions">
        <button className="btn" onClick={onToggleTheme} aria-label="Toggle theme">
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>
      </div>
    </header>
  );
}
