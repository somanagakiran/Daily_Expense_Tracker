const CATEGORIES = ["Food", "Travel", "Shopping", "Bills", "Health", "Education", "Entertainment", "Other"];
const PAYMENT_MODES = ["Cash", "UPI", "Card", "Net Banking"];

// Returns an error message string, or null if the expense is valid
function validate(body) {
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

module.exports = validate;
