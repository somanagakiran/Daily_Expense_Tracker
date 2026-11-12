import { useEffect, useState } from "react";
import { api } from "../api";
import { CATEGORIES, money, sum, today, thisMonth, monthName, toISODate, toast } from "../utils";

function StatCard({ icon, label, value, hint, accent }) {
  return (
    <div className="stat" style={{ "--accent": accent }}>
      <div className="stat-icon">{icon}</div>
      <p className="stat-label">{label}</p>
      <h2 className="stat-value">{value}</h2>
      <small className="stat-hint">{hint}</small>
    </div>
  );
}

function BudgetCard({ spent }) {
  const [budget, setBudget] = useState(0);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    api.getBudget().then((b) => setBudget(b.monthlyBudget)).catch(() => {});
  }, []);

  const save = async (e) => {
    e.preventDefault();
    try {
      const res = await api.setBudget(Number(draft));
      setBudget(res.monthlyBudget);
      setEditing(false);
      toast("Budget updated");
    } catch (err) {
      toast(err.message, "error");
    }
  };

  const percent = budget ? Math.min(100, (spent / budget) * 100) : 0;
  const left = budget - spent;
  const level = percent >= 100 ? "danger" : percent >= 80 ? "warn" : "ok";

  return (
    <div className={`panel budget ${level}`}>
      <div className="panel-head">
        <h3>🎯 Monthly budget</h3>
        {!editing && (
          <button className="link-btn" onClick={() => { setDraft(budget); setEditing(true); }}>Edit</button>
        )}
      </div>
      {editing ? (
        <form className="budget-form" onSubmit={save}>
          <input type="number" min="1" value={draft} onChange={(e) => setDraft(e.target.value)} autoFocus />
          <button className="btn small">Save</button>
          <button type="button" className="btn ghost small" onClick={() => setEditing(false)}>Cancel</button>
        </form>
      ) : (
        <>
          <div className="budget-numbers">
            <span><b>{money(spent)}</b> spent</span>
            <span>of {money(budget)}</span>
          </div>
          <div className="progress"><div style={{ width: `${percent}%` }} /></div>
          <p className="budget-msg">
            {left >= 0
              ? `${money(left)} left for ${monthName(thisMonth())} (${percent.toFixed(0)}% used)`
              : `⚠️ Over budget by ${money(-left)}!`}
          </p>
        </>
      )}
    </div>
  );
}

function CategoryBreakdown({ list }) {
  const total = sum(list);
  const rows = Object.keys(CATEGORIES)
    .map((name) => ({ name, value: sum(list.filter((e) => e.category === name)) }))
    .filter((r) => r.value > 0)
    .sort((a, b) => b.value - a.value);

  // Donut chart built with SVG stroke-dasharray
  const R = 54, C = 2 * Math.PI * R;
  let offset = 0;

  return (
    <div className="panel">
      <div className="panel-head"><h3>📊 This month by category</h3></div>
      {rows.length === 0 ? (
        <p className="empty small">No spending this month yet.</p>
      ) : (
        <div className="breakdown">
          <svg viewBox="0 0 140 140" className="donut">
            <circle cx="70" cy="70" r={R} className="donut-track" />
            {rows.map((r) => {
              const len = (r.value / total) * C;
              const el = (
                <circle key={r.name} cx="70" cy="70" r={R} fill="none" stroke={CATEGORIES[r.name].color}
                  strokeWidth="18" strokeDasharray={`${len} ${C - len}`} strokeDashoffset={-offset}
                  transform="rotate(-90 70 70)"><title>{`${r.name}: ${money(r.value)}`}</title></circle>
              );
              offset += len;
              return el;
            })}
            <text x="70" y="66" textAnchor="middle" className="donut-label">Total</text>
            <text x="70" y="84" textAnchor="middle" className="donut-value">{money(total)}</text>
          </svg>
          <ul className="legend">
            {rows.map((r) => (
              <li key={r.name}>
                <span className="dot" style={{ background: CATEGORIES[r.name].color }} />
                <span className="legend-name">{CATEGORIES[r.name].icon} {r.name}</span>
                <span className="legend-pct">{((r.value / total) * 100).toFixed(0)}%</span>
                <b>{money(r.value)}</b>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function Last7Days({ list }) {
  const days = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const iso = toISODate(d);
    return { iso, label: d.toLocaleDateString("en-IN", { weekday: "short" }), value: sum(list.filter((e) => e.date === iso)) };
  });
  const max = Math.max(...days.map((d) => d.value), 1);

  return (
    <div className="panel">
      <div className="panel-head"><h3>📈 Last 7 days</h3><span className="muted">{money(sum(days.map((d) => ({ amount: d.value }))))}</span></div>
      <div className="bars">
        {days.map((d) => (
          <div key={d.iso} className={`bar-col ${d.iso === today() ? "is-today" : ""}`} title={`${d.label}: ${money(d.value)}`}>
            <span className="bar-amt">{d.value ? money(d.value) : ""}</span>
            <div className="bar" style={{ height: `${(d.value / max) * 100}%` }} />
            <span className="bar-label">{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Summary({ expenses }) {
  const monthList = expenses.filter((e) => e.date.startsWith(thisMonth()));
  const todayList = expenses.filter((e) => e.date === today());
  const daysSoFar = new Date().getDate();
  const biggest = monthList.reduce((m, e) => (Number(e.amount) > Number(m?.amount || 0) ? e : m), null);

  return (
    <section className="summary">
      <div className="stats">
        <StatCard icon="💰" label="Total spent" value={money(sum(expenses))} hint={`${expenses.length} transactions`} accent="#6366f1" />
        <StatCard icon="🗓️" label="This month" value={money(sum(monthList))} hint={`Avg ${money(sum(monthList) / daysSoFar)} / day`} accent="#0ea5e9" />
        <StatCard icon="☀️" label="Today" value={money(sum(todayList))} hint={`${todayList.length} expense${todayList.length === 1 ? "" : "s"} today`} accent="#f97316" />
        <StatCard icon="🔥" label="Biggest this month" value={biggest ? money(biggest.amount) : "—"} hint={biggest ? biggest.title : "Nothing yet"} accent="#ef4444" />
      </div>
      <div className="grid-3">
        <BudgetCard spent={sum(monthList)} />
        <CategoryBreakdown list={monthList} />
        <Last7Days list={expenses} />
      </div>
    </section>
  );
}
