const db = require("../utils/db");

const CATEGORIES = ["Food", "Travel", "Shopping", "Bills", "Health", "Education", "Entertainment", "Other"];
const PAYMENT_MODES = ["Cash", "UPI", "Card", "Net Banking"];

// ---------- helpers ----------
function validate(body) {
  const errors = [];
  const title = String(body.title || "").trim();
  const amount = Number(body.amount);
  const date = String(body.date || "");

  if (!title) errors.push("Description is required");
  if (title.length > 60) errors.push("Description must be under 60 characters");
  if (!Number.isFinite(amount) || amount <= 0) errors.push("Amount must be greater than 0");
  if (amount > 10000000) errors.push("Amount is too large");
  if (!CATEGORIES.includes(body.category)) errors.push("Invalid category");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || isNaN(new Date(date))) errors.push("Invalid date");
  if (body.payment && !PAYMENT_MODES.includes(body.payment)) errors.push("Invalid payment mode");

  return {
    errors,
    value: {
      title,
      amount: Math.round(amount * 100) / 100,
      category: body.category,
      date,
      payment: body.payment || "Cash",
      note: String(body.note || "").trim().slice(0, 120),
    },
  };
}

const byDateDesc = (a, b) => b.date.localeCompare(a.date) || Number(b.id) - Number(a.id);

// ---------- expenses ----------
exports.getExpenses = (req, res) => {
  let list = db.getExpenses();
  const { category, month, search } = req.query;
  if (category && category !== "All") list = list.filter((e) => e.category === category);
  if (month) list = list.filter((e) => e.date.startsWith(month));
  if (search) {
    const q = search.toLowerCase();
    list = list.filter((e) => e.title.toLowerCase().includes(q) || (e.note || "").toLowerCase().includes(q));
  }
  res.json(list.sort(byDateDesc));
};

exports.getExpenseById = (req, res) => {
  const item = db.getExpenses().find((e) => e.id === req.params.id);
  if (!item) return res.status(404).json({ message: "Expense not found" });
  res.json(item);
};

exports.addExpense = (req, res) => {
  const { errors, value } = validate(req.body);
  if (errors.length) return res.status(400).json({ message: errors.join(", "), errors });

  const list = db.getExpenses();
  const item = { id: Date.now().toString(), ...value, createdAt: new Date().toISOString() };
  list.push(item);
  db.saveExpenses(list);
  res.status(201).json(item);
};

exports.updateExpense = (req, res) => {
  const list = db.getExpenses();
  const index = list.findIndex((e) => e.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: "Expense not found" });

  const { errors, value } = validate({ ...list[index], ...req.body });
  if (errors.length) return res.status(400).json({ message: errors.join(", "), errors });

  list[index] = { ...list[index], ...value, updatedAt: new Date().toISOString() };
  db.saveExpenses(list);
  res.json(list[index]);
};

exports.deleteExpense = (req, res) => {
  const list = db.getExpenses();
  const updated = list.filter((e) => e.id !== req.params.id);
  if (updated.length === list.length) return res.status(404).json({ message: "Expense not found" });
  db.saveExpenses(updated);
  res.json({ message: "Expense deleted" });
};

// ---------- stats ----------
exports.getStats = (req, res) => {
  const list = db.getExpenses();
  const month = req.query.month || new Date().toISOString().slice(0, 7);
  const monthly = list.filter((e) => e.date.startsWith(month));

  const byCategory = {};
  monthly.forEach((e) => (byCategory[e.category] = (byCategory[e.category] || 0) + e.amount));

  res.json({
    month,
    total: list.reduce((s, e) => s + e.amount, 0),
    monthTotal: monthly.reduce((s, e) => s + e.amount, 0),
    count: list.length,
    byCategory,
  });
};

// ---------- budget ----------
exports.getBudget = (req, res) => res.json({ monthlyBudget: db.getSettings().monthlyBudget });

exports.setBudget = (req, res) => {
  const amount = Number(req.body.monthlyBudget);
  if (!Number.isFinite(amount) || amount <= 0) return res.status(400).json({ message: "Budget must be greater than 0" });
  const settings = { ...db.getSettings(), monthlyBudget: Math.round(amount) };
  db.saveSettings(settings);
  res.json(settings);
};

exports.CATEGORIES = CATEGORIES;
exports.PAYMENT_MODES = PAYMENT_MODES;
