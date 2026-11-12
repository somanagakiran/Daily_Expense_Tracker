const express = require("express");
const cors = require("cors");
const { readData, saveData } = require("./utils/db");
const validate = require("./utils/validate");
const budgetRoutes = require("./routes/budgetRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/expenses", (req, res) => {
  res.json(readData());
});

app.post("/api/expenses", (req, res) => {
  const error = validate(req.body);
  if (error) return res.status(400).json({ message: error });
  const expenses = readData();
  const newExpense = { id: Date.now().toString(), ...req.body, amount: Number(req.body.amount) };
  expenses.push(newExpense);
  saveData(expenses);
  res.status(201).json(newExpense);
});

app.put("/api/expenses/:id", (req, res) => {
  const error = validate(req.body);
  if (error) return res.status(400).json({ message: error });
  const expenses = readData();
  const index = expenses.findIndex((e) => e.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: "Expense not found" });
  expenses[index] = { ...expenses[index], ...req.body, amount: Number(req.body.amount) };
  saveData(expenses);
  res.json(expenses[index]);
});

app.delete("/api/expenses/:id", (req, res) => {
  const expenses = readData().filter((e) => e.id !== req.params.id);
  saveData(expenses);
  res.json({ message: "Expense deleted" });
});

app.use("/api/budget", budgetRoutes);

app.listen(5000, () => console.log("Server running on port 5000"));
