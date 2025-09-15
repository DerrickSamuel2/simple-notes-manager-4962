import React, { useEffect, useState } from "react";
import "./App.css";
import "./index.css";
import Header from "./components/Header";
import Layout from "./components/Layout";
import { NotesProvider } from "./context/NotesContext";

// PUBLIC_INTERFACE
function App() {
  /** Root application component: sets theme and composes the notes UI. */
  const [theme, setTheme] = useState("light");
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => setTheme((t) => (t === "light" ? "dark" : "light"));

  return (
    <div className="app-root">
      <NotesProvider>
        <Header theme={theme} onToggleTheme={toggleTheme} />
        <Layout />
        <footer className="footer">Built with React • Local mock API • Ready for backend integration</footer>
      </NotesProvider>
    </div>
  );
}

export default App;
