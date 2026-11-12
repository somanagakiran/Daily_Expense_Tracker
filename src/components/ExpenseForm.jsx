import { useState } from "react";
import { api } from "../api";
import { CATEGORIES, PAYMENT_MODES, emptyForm, toast } from "../utils";

// Used for both "Add" (no `initial`) and "Edit" (with `initial`)
export default function ExpenseForm({ onSave, initial, onCancel }) {
  const isEdit = Boolean(initial);
  const [form, setForm] = useState(initial || emptyForm());
  const [saving, setSaving] = useState(false);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return toast("Please enter a description", "error");
    if (!(Number(form.amount) > 0)) return toast("Amount must be greater than 0", "error");

    setSaving(true);
    try {
      if (isEdit) await api.update(initial.id, form);
      else await api.add(form);
      toast(isEdit ? "Expense updated" : `Added ${form.title}`);
      if (!isEdit) setForm({ ...emptyForm(), category: form.category, payment: form.payment, date: form.date });
      onSave?.();
    } catch (err) {
      toast(err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className={isEdit ? "" : "panel"}>
      {!isEdit && <div className="panel-head"><h3>➕ Add new expense</h3></div>}

      <div className="cat-picker">
        {Object.entries(CATEGORIES).map(([name, c]) => (
          <button type="button" key={name}
            className={`cat-pill ${form.category === name ? "active" : ""}`}
            style={{ "--c": c.color }}
            onClick={() => setForm({ ...form, category: name })}>
            {c.icon} {name}
          </button>
        ))}
      </div>

      <form onSubmit={submit} className="form">
        <label className="span-2">Description
          <input value={form.title} onChange={set("title")} placeholder="e.g. Lunch at canteen" maxLength={60} required />
        </label>
        <label>Amount (₹)
          <input type="number" min="0.01" step="0.01" value={form.amount} onChange={set("amount")} placeholder="0" required />
        </label>
        <label>Date
          <input type="date" value={form.date} onChange={set("date")} required />
        </label>
        <label>Payment mode
          <select value={form.payment} onChange={set("payment")}>
            {PAYMENT_MODES.map((p) => <option key={p}>{p}</option>)}
          </select>
        </label>
        <label className="span-2">Note (optional)
          <input value={form.note} onChange={set("note")} placeholder="Any extra details" maxLength={120} />
        </label>
        <div className="form-actions">
          {isEdit && <button type="button" className="btn ghost" onClick={onCancel}>Cancel</button>}
          <button type="submit" className="btn" disabled={saving}>
            {saving ? "Saving..." : isEdit ? "💾 Save changes" : "+ Add Expense"}
          </button>
        </div>
      </form>
    </section>
  );
}
