import { useEffect, useState } from "react";

export default function Navbar() {
  const [dark, setDark] = useState(() => {
    try { return localStorage.getItem("theme") === "dark"; } catch { return false; }
  });

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    try { localStorage.setItem("theme", dark ? "dark" : "light"); } catch {}
  }, [dark]);

  return (
    <nav className="navbar">
      <div className="nav-inner">
        <span className="nav-title">Daily Expense Tracker</span>
        <div className="nav-right">
          <span className="nav-date">
            {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </span>
          <button className="nav-btn" onClick={() => setDark(!dark)}>
            {dark ? "Light mode" : "Dark mode"}
          </button>
        </div>
      </div>
    </nav>
  );
}
