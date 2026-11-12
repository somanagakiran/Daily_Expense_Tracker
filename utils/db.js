const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "..", "data");
const FILE = path.join(DATA_DIR, "expenses.json");

// Read all expenses from the JSON file
function readData() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(FILE)) fs.writeFileSync(FILE, "[]");
  try {
    const text = fs.readFileSync(FILE, "utf8");
    return text.trim() ? JSON.parse(text) : [];
  } catch (err) {
    console.error("Could not read expenses.json:", err.message);
    return [];
  }
}

// Save all expenses to the JSON file (temp file + rename, so a crash never leaves a half-written file)
function saveData(list) {
  const tmp = FILE + ".tmp";
  fs.writeFileSync(tmp, JSON.stringify(list, null, 2));
  fs.renameSync(tmp, FILE);
}

// ---------- functions used by server.js ----------

function getAll() {
  return readData();
}

function add(expense) {
  const newExpense = { id: Date.now().toString(), ...expense };
  saveData([...readData(), newExpense]);
  return newExpense;
}

function update(id, changes) {
  const list = readData().map((e) => (e.id === id ? { ...e, ...changes } : e));
  saveData(list);
  return list.find((e) => e.id === id);
}

function remove(id) {
  saveData(readData().filter((e) => e.id !== id));
  return { message: "Expense deleted" };
}

module.exports = { readData, saveData, getAll, add, update, remove };
