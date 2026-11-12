import { useEffect, useState } from "react";

function getInitialTheme() {
  try {
    const saved = localStorage.getItem("theme");
    if (saved) return saved;
  } catch {}
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export default function Header() {
  const [theme, setTheme] = useState(getInitialTheme);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem("theme", theme); } catch {}
  }, [theme]);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(t);
  }, []);

  const hour = now.getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <header className="header">
      <div className="brand">
        <div className="logo">₹</div>
        <div>
          <p className="eyebrow">{greeting} 👋</p>
          <h1>Daily Expense Tracker</h1>
          <p className="sub">Track every rupee. Stay within budget.</p>
        </div>
      </div>
      <div className="header-right">
        <span className="chip">
          📅 {now.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}
        </span>
        <button
          className="icon-btn"
          title="Toggle dark mode"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? "☀️" : "🌙"}
        </button>
      </div>
    </header>
  );
}
