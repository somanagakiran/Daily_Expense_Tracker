import { useEffect, useState } from "react";
import { CATEGORIES, money, sum, today, thisMonth, monthName, toISODate, toast } from "../utils";

function Card({ label, value, note, color }) {
  return (
    <div className="card" style={{ borderTopColor: color }}>
      <p className="card-label">{label}</p>
      <h2 className="card-value">{value}</h2>
      <p className="card-note">{note}</p>
    </div>
  );
}

const DEFAULT_BUDGET = 15000;

function loadBudget() {
  try {
    const saved = Number(localStorage.getItem("monthlyBudget"));
    return saved > 0 ? saved : DEFAULT_BUDGET;
  } catch {
    return DEFAULT_BUDGET;
  }
}

// Monthly budget is saved in the browser (localStorage)
function Budget({ spent }) {
  const [budget, setBudget] = useState(loadBudget);
  const [editing, setEditing] = useState(false);
  const [input, setInput] = useState("");

  useEffect(() => {
    try { localStorage.setItem("monthlyBudget", budget); } catch {}
  }, [budget]);

  const save = (e) => {
    e.preventDefault();
    const value = Math.round(Number(input));
    if (!(value > 0)) return toast("Budget must be greater than 0", "error");
    setBudget(value);
    setEditing(false);
    toast("Budget updated");
  };

  const percent = budget ? Math.min(100, (spent / budget) * 100) : 0;
  const left = budget - spent;
  const status = percent >= 100 ? "over" : percent >= 80 ? "warn" : "ok";

  return (
    <div className="box">
      <div className="box-head">
        <h3>Monthly Budget</h3>
        {!editing && <button className="link" onClick={() => { setInput(budget); setEditing(true); }}>Change</button>}
      </div>
      {editing ? (
        <form className="inline-form" onSubmit={save}>
          <input type="number" min="1" value={input} onChange={(e) => setInput(e.target.value)} autoFocus />
          <button className="btn btn-primary">Save</button>
          <button type="button" className="btn" onClick={() => setEditing(false)}>Cancel</button>
        </form>
      ) : (
        <>
          <p className="budget-line">
            <b>{money(spent)}</b> spent of {money(budget)}
          </p>
          <div className={`progress ${status}`}><div style={{ width: `${percent}%` }} /></div>
          <p className={`budget-status ${status}`}>
            {left >= 0
              ? `${money(left)} remaining for ${monthName(thisMonth())} (${percent.toFixed(0)}% used)`
              : `Budget exceeded by ${money(-left)}`}
          </p>
        </>
      )}
    </div>
  );
}

function CategoryWise({ list }) {
  const total = sum(list);
  const rows = Object.keys(CATEGORIES)
    .map((name) => ({ name, value: sum(list.filter((e) => e.category === name)) }))
    .filter((r) => r.value > 0)
    .sort((a, b) => b.value - a.value);

  return (
    <div className="box">
      <div className="box-head"><h3>Category-wise (this month)</h3></div>
      {rows.length === 0 && <p className="muted">No expenses this month.</p>}
      {rows.map((r) => (
        <div key={r.name} className="cat-row">
          <span className="cat-name">{r.name}</span>
          <div className="cat-bar"><div style={{ width: `${(r.value / total) * 100}%`, background: CATEGORIES[r.name] }} /></div>
          <span className="cat-amt">{money(r.value)}</span>
        </div>
      ))}
    </div>
  );
}

function LastWeek({ list }) {
  const days = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const iso = toISODate(d);
    return { iso, label: d.toLocaleDateString("en-IN", { weekday: "short" }), value: sum(list.filter((e) => e.date === iso)) };
  });
  const max = Math.max(...days.map((d) => d.value), 1);

  return (
    <div className="box">
      <div className="box-head"><h3>Last 7 Days</h3></div>
      <div className="week">
        {days.map((d) => (
          <div key={d.iso} className={`week-col ${d.iso === today() ? "today" : ""}`} title={money(d.value)}>
            <small>{d.value ? money(d.value) : "-"}</small>
            <div className="week-bar" style={{ height: `${(d.value / max) * 100}%` }} />
            <span>{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Summary({ expenses }) {
  const total = sum(expenses);
  const monthList = expenses.filter((e) => e.date.startsWith(thisMonth()));
  const todayList = expenses.filter((e) => e.date === today());
  const highest = monthList.reduce((m, e) => (Number(e.amount) > Number(m?.amount || 0) ? e : m), null);

  return (
    <>
      <div className="cards">
        <Card label="Total Expenses" value={money(total)} note={`${expenses.length} entries`} color="#2c3e50" />
        <Card label="This Month" value={money(sum(monthList))} note={`${monthList.length} entries`} color="#2980b9" />
        <Card label="Today" value={money(sum(todayList))} note={`${todayList.length} entries`} color="#27ae60" />
        <Card label="Highest (this month)" value={highest ? money(highest.amount) : "-"} note={highest ? highest.title : "No data"} color="#c0392b" />
      </div>
      <div className="row-3">
        <Budget spent={sum(monthList)} />
        <CategoryWise list={monthList} />
        <LastWeek list={expenses} />
      </div>
    </>
  );
}
