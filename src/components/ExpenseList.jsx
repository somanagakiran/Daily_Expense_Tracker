import { useMemo, useState } from "react";
import { api } from "../api";
import { CATEGORIES, money, prettyDate, monthName, sum, toast, exportCSV } from "../utils";
import EditModal from "./EditModal";

const SORTS = {
  "date-desc": (a, b) => b.date.localeCompare(a.date),
  "date-asc": (a, b) => a.date.localeCompare(b.date),
  "amount-desc": (a, b) => b.amount - a.amount,
  "amount-asc": (a, b) => a.amount - b.amount,
};

export default function ExpenseList({ expenses, onChange }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [month, setMonth] = useState("All");
  const [sort, setSort] = useState("date-desc");
  const [editing, setEditing] = useState(null);

  const months = useMemo(
    () => [...new Set(expenses.map((e) => e.date.slice(0, 7)))].sort().reverse(),
    [expenses]
  );

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return expenses
      .filter((e) => category === "All" || e.category === category)
      .filter((e) => month === "All" || e.date.startsWith(month))
      .filter((e) => !q || e.title.toLowerCase().includes(q) || (e.note || "").toLowerCase().includes(q))
      .sort(SORTS[sort]);
  }, [expenses, search, category, month, sort]);

  const remove = async (item) => {
    if (!window.confirm(`Delete "${item.title}" (${money(item.amount)})?`)) return;
    try {
      await api.remove(item.id);
      toast("Expense deleted");
      onChange();
    } catch (err) {
      toast(err.message, "error");
    }
  };

  const filtered = search || category !== "All" || month !== "All";
  const clear = () => { setSearch(""); setCategory("All"); setMonth("All"); };

  return (
    <section className="panel">
      <div className="panel-head">
        <h3>🧾 Transactions</h3>
        <div className="head-actions">
          <span className="muted">{visible.length} of {expenses.length} · <b>{money(sum(visible))}</b></span>
          <button className="btn ghost small" onClick={() => exportCSV(visible)} disabled={!visible.length}>⬇ Export CSV</button>
        </div>
      </div>

      <div className="filters">
        <input className="search" placeholder="🔍 Search description or note..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="All">All categories</option>
          {Object.keys(CATEGORIES).map((c) => <option key={c}>{c}</option>)}
        </select>
        <select value={month} onChange={(e) => setMonth(e.target.value)}>
          <option value="All">All months</option>
          {months.map((m) => <option key={m} value={m}>{monthName(m)}</option>)}
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="date-desc">Newest first</option>
          <option value="date-asc">Oldest first</option>
          <option value="amount-desc">Highest amount</option>
          <option value="amount-asc">Lowest amount</option>
        </select>
        {filtered && <button className="link-btn" onClick={clear}>Clear filters</button>}
      </div>

      {visible.length === 0 ? (
        <div className="empty">
          <div className="empty-icon">🪙</div>
          <p>{expenses.length ? "No expenses match your filters." : "No expenses yet. Add your first one above!"}</p>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Description</th><th>Category</th><th>Date</th><th>Payment</th><th className="right">Amount</th><th className="right">Actions</th></tr>
            </thead>
            <tbody>
              {visible.map((item) => {
                const c = CATEGORIES[item.category] || CATEGORIES.Other;
                return (
                  <tr key={item.id}>
                    <td>
                      <div className="title-cell">
                        <span className="row-icon" style={{ background: c.color + "22" }}>{c.icon}</span>
                        <div><b>{item.title}</b>{item.note && <small>{item.note}</small>}</div>
                      </div>
                    </td>
                    <td><span className="badge" style={{ "--c": c.color }}>{item.category}</span></td>
                    <td className="nowrap">{prettyDate(item.date)}</td>
                    <td><span className="pay">{item.payment || "Cash"}</span></td>
                    <td className="right money">{money(item.amount)}</td>
                    <td className="right nowrap">
                      <button className="icon-btn small" title="Edit" onClick={() => setEditing(item)}>✏️</button>
                      <button className="icon-btn small danger" title="Delete" onClick={() => remove(item)}>🗑️</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <EditModal
          expense={editing}
          onClose={() => setEditing(null)}
          onSaved={() => { setEditing(null); onChange(); }}
        />
      )}
    </section>
  );
}
