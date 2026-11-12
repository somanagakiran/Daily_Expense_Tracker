const express = require("express");
const { getSettings, saveSettings } = require("../utils/db");

const router = express.Router();

// GET /api/budget  -> { monthlyBudget }
router.get("/", (req, res) => {
  res.json({ monthlyBudget: getSettings().monthlyBudget });
});

// PUT /api/budget  { monthlyBudget }
router.put("/", (req, res) => {
  const amount = Number(req.body.monthlyBudget);
  if (!Number.isFinite(amount) || amount <= 0) {
    return res.status(400).json({ message: "Budget must be greater than 0" });
  }
  const settings = { ...getSettings(), monthlyBudget: Math.round(amount) };
  saveSettings(settings);
  res.json(settings);
});

module.exports = router;
