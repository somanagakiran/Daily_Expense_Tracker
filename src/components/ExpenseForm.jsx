import { useEffect, useRef, useState } from "react";
import { api } from "../api";
import { CATEGORIES, PAYMENT_MODES, emptyForm, toast } from "../utils";

export default function ExpenseForm({ editItem, setEditItem, onSave }) {
  const [form, setForm] = useState(emptyForm());
  const [saving, setSaving] = useState(false);
  const ref = useRef(null);

  // When "Edit" is clicked in the table, fill the form with that expense
  useEffect(() => {
    if (editItem) {
      setForm({ ...emptyForm(), ...editItem });
      ref.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [editItem]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const cancelEdit = () => {
    setEditItem(null);
    setForm(emptyForm());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return toast("Please enter description", "error");
    if (!(Number(form.amount) > 0)) return toast("Amount must be greater than 0", "error");

    const { title, amount, category, date, payment, note } = form;
    const data = { title: title.trim(), amount, category, date, payment, note: note.trim() };

    setSaving(true);
    try {
      if (editItem) {
        await api.update(editItem.id, data);
        toast("Expense updated");
        cancelEdit();
      } else {
        await api.add(data);
        toast("Expense added");
        setForm({ ...emptyForm(), date: form.date });
      }
      onSave();
    } catch (err) {
      toast(err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={`box ${editItem ? "editing" : ""}`} ref={ref}>
      <div className="box-head">
        <h3>{editItem ? "Edit Expense" : "Add Expense"}</h3>
      </div>
      <form className="form" onSubmit={handleSubmit}>
        <div className="field wide">
          <label>Description</label>
          <input name="title" value={form.title} onChange={handleChange} placeholder="e.g. Lunch" maxLength={60} />
        </div>
        <div className="field">
          <label>Amount (₹)</label>
          <input name="amount" type="number" min="0.01" step="0.01" value={form.amount} onChange={handleChange} placeholder="0" />
        </div>
        <div className="field">
          <label>Category</label>
          <select name="category" value={form.category} onChange={handleChange}>
            {Object.keys(CATEGORIES).map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div className="field">
          <label>Date</label>
          <input name="date" type="date" value={form.date} onChange={handleChange} />
        </div>
        <div className="field">
          <label>Payment</label>
          <select name="payment" value={form.payment} onChange={handleChange}>
            {PAYMENT_MODES.map((p) => <option key={p}>{p}</option>)}
          </select>
        </div>
        <div className="field wide">
          <label>Note (optional)</label>
          <input name="note" value={form.note} onChange={handleChange} placeholder="Extra details" maxLength={120} />
        </div>
        <div className="form-buttons">
          {editItem && <button type="button" className="btn" onClick={cancelEdit}>Cancel</button>}
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? "Saving..." : editItem ? "Update Expense" : "Add Expense"}
          </button>
        </div>
      </form>
    </div>
  );
}
