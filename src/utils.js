export const CATEGORIES = {
  Food: "#e67e22",
  Travel: "#2980b9",
  Shopping: "#c0392b",
  Bills: "#f1c40f",
  Health: "#27ae60",
  Education: "#8e44ad",
  Entertainment: "#e84393",
  Other: "#7f8c8d",
};

export const PAYMENT_MODES = ["Cash", "UPI", "Card", "Net Banking"];

const pad = (n) => String(n).padStart(2, "0");
export const toISODate = (d = new Date()) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const today = () => toISODate();
export const thisMonth = () => today().slice(0, 7);

export const money = (n) =>
  "₹" + Number(n || 0).toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 2 });

export const prettyDate = (iso) =>
  new Date(iso + "T00:00:00").toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

export const monthName = (ym) =>
  new Date(ym + "-01T00:00:00").toLocaleDateString("en-IN", { month: "long", year: "numeric" });

export const sum = (list) => list.reduce((s, e) => s + Number(e.amount), 0);

export const emptyForm = () => ({ title: "", amount: "", category: "Food", date: today(), payment: "Cash", note: "" });

// Small message box at the bottom-right corner
export function toast(message, type = "success") {
  let box = document.getElementById("toast-box");
  if (!box) {
    box = document.createElement("div");
    box.id = "toast-box";
    document.body.appendChild(box);
  }
  const el = document.createElement("div");
  el.className = `toast ${type}`;
  el.textContent = message;
  box.appendChild(el);
  setTimeout(() => el.remove(), 2500);
}

// Download the given expenses as a CSV file (opens in Excel)
export function exportCSV(list) {
  const header = ["Date", "Description", "Category", "Payment", "Amount", "Note"];
  const rows = list.map((e) => [e.date, e.title, e.category, e.payment || "Cash", e.amount, e.note || ""]);
  const csv = [header, ...rows]
    .map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
    .join("\n");
  const url = URL.createObjectURL(new Blob(["﻿" + csv], { type: "text/csv" }));
  const a = Object.assign(document.createElement("a"), { href: url, download: `expenses-${today()}.csv` });
  a.click();
  URL.revokeObjectURL(url);
}
