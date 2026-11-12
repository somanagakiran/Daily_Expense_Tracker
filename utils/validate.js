const { readData } = require("./db");

const CATEGORIES = ["Food", "Travel", "Shopping", "Bills", "Health", "Education", "Entertainment", "Other"];
const PAYMENT_MODES = ["Cash", "UPI", "Card", "Net Banking"];

// Returns an error message string, or null if the expense is valid
function check(body) {
  const title = String(body.title || "").trim();
  const amount = Number(body.amount);
  const date = String(body.date || "");

  if (!title) return "Description is required";
  if (title.length > 60) return "Description must be under 60 characters";
  if (!Number.isFinite(amount) || amount <= 0) return "Amount must be greater than 0";
  if (amount > 10000000) return "Amount is too large";
  if (!CATEGORIES.includes(body.category)) return "Please choose a valid category";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || isNaN(new Date(date))) return "Please choose a valid date";
  if (body.payment && !PAYMENT_MODES.includes(body.payment)) return "Invalid payment mode";
  if (body.note && String(body.note).length > 120) return "Note must be under 120 characters";
  return null;
}

// Express middleware used on POST and PUT routes:
// - for PUT, returns 404 if the expense does not exist
// - returns 400 with a message if the data is invalid
// - otherwise cleans req.body (only allowed fields, amount as number) and continues
function validate(req, res, next) {
  if (req.params.id && !readData().some((e) => e.id === req.params.id)) {
    return res.status(404).json({ message: "Expense not found" });
  }

  const error = check(req.body);
  if (error) return res.status(400).json({ message: error });

  const { title, amount, category, date, payment, note } = req.body;
  req.body = {
    title: String(title).trim(),
    amount: Math.round(Number(amount) * 100) / 100,
    category,
    date,
    payment: payment || "Cash",
    note: String(note || "").trim(),
  };
  next();
}

module.exports = validate;
