const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "..", "data");
const EXPENSES_FILE = path.join(DATA_DIR, "expenses.json");
const SETTINGS_FILE = path.join(DATA_DIR, "settings.json");

const DEFAULT_SETTINGS = { monthlyBudget: 15000 };

function ensureFile(file, fallback) {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(file)) fs.writeFileSync(file, JSON.stringify(fallback, null, 2));
}

function readJSON(file, fallback) {
  ensureFile(file, fallback);
  try {
    const text = fs.readFileSync(file, "utf8");
    return text.trim() ? JSON.parse(text) : fallback;
  } catch (err) {
    console.error(`Could not read ${path.basename(file)}, using defaults:`, err.message);
    return fallback;
  }
}

function writeJSON(file, data) {
  ensureFile(file, data);
  // Write to a temp file first, then rename, so a crash never leaves a half-written file.
  const tmp = `${file}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2));
  fs.renameSync(tmp, file);
}

module.exports = {
  getExpenses: () => readJSON(EXPENSES_FILE, []),
  saveExpenses: (list) => writeJSON(EXPENSES_FILE, list),
  getSettings: () => ({ ...DEFAULT_SETTINGS, ...readJSON(SETTINGS_FILE, DEFAULT_SETTINGS) }),
  saveSettings: (settings) => writeJSON(SETTINGS_FILE, settings),
};
