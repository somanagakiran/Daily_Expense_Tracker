import { useMemo, useState } from "react";
import { CATEGORIES, money, prettyDate, monthName, sum, exportCSV, toast } from "../utils";

const SORTS = {
  newest: (a, b) => b.date.localeCompare(a.date) || Number(b.id) - Number(a.id),
  oldest: (a, b) => a.date.localeCompare(b.date) || Number(a.id) - Number(b.id),
  high: (a, b) => b.amount - a.amount,
  low: (a, b) => a.amount - b.amount,
};

export default function ExpenseList({ expenses, setEditItem, deleteExpense }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [month, setMonth] = useState("All");
  const [sort, setSort] = useState("newest");

  const months = useMemo(
    () => [...new Set(expenses.map((e) => e.date.slice(0, 7)))].sort().reverse(),
    [expenses]
  );

  const list = useMemo(() => {
    const q = search.trim().toLowerCase();
    return expenses
      .filter((e) => category === "All" || e.category === category)
      .filter((e) => month === "All" || e.date.startsWith(month))
      .filter((e) => !q || e.title.toLowerCase().includes(q) || (e.note || "").toLowerCase().includes(q))
      .sort(SORTS[sort]);
  }, [expenses, search, category, month, sort]);

  const isFiltered = search || category !== "All" || month !== "All";

  return (
    <div className="box">
      <div className="box-head">
        <h3>Expense List</h3>
        <button className="btn" onClick={() => exportCSV(list)} disabled={!list.length}>Export CSV</button>
      </div>

      <div className="filters">
        <input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="All">All Categories</option>
          {Object.keys(CATEGORIES).map((c) => <option key={c}>{c}</option>)}
        </select>
        <select value={month} onChange={(e) => setMonth(e.target.value)}>
          <option value="All">All Months</option>
          {months.map((m) => <option key={m} value={m}>{monthName(m)}</option>)}
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="high">Amount: High to Low</option>
          <option value="low">Amount: Low to High</option>
        </select>
        {isFiltered && (
          <button className="link" onClick={() => { setSearch(""); setCategory("All"); setMonth("All"); }}>Clear</button>
        )}
      </div>

      {list.length === 0 ? (
        <p className="empty">{expenses.length ? "No expenses match the filters." : "No expenses added yet."}</p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>#</th><th>Description</th><th>Category</th><th>Date</th><th>Payment</th>
                <th className="right">Amount</th><th className="center">Action</th>
              </tr>
            </thead>
            <tbody>
              {list.map((item, i) => (
                <tr key={item.id}>
                  <td>{i + 1}</td>
                  <td>
                    {item.title}
                    {item.note && <div className="note">{item.note}</div>}
                  </td>
                  <td>
                    <span className="dot" style={{ background: CATEGORIES[item.category] || "#999" }} />
                    {item.category}
                  </td>
                  <td className="nowrap">{prettyDate(item.date)}</td>
                  <td>{item.payment || "Cash"}</td>
                  <td className="right amount">{money(item.amount)}</td>
                  <td className="center nowrap">
                    <button className="btn btn-small" onClick={() => setEditItem(item)}>Edit</button>
                    <button
                      className="btn btn-small btn-danger"
                      onClick={async () => {
                        if (!window.confirm(`Delete "${item.title}" (${money(item.amount)})?`)) return;
                        await deleteExpense(item.id);
                        toast("Expense deleted");
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="5" className="right"><b>Total ({list.length} entries)</b></td>
                <td className="right amount">{money(sum(list))}</td>
                <td />
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
}
