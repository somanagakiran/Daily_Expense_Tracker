const express = require("express");
const cors = require("cors");
const { readData, saveData } = require("./utils/db");
const validate = require("./utils/validate");
const budgetRoutes = require("./routes/budgetRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/expenses", (req, res) => res.json(readData()));

app.post("/api/expenses", validate, (req, res) => {
  const expense = { id: Date.now().toString(), ...req.body };
  saveData([...readData(), expense]);
  res.status(201).json(expense);
});

app.put("/api/expenses/:id", validate, (req, res) => {
  const expenses = readData().map((e) => (e.id === req.params.id ? { ...e, ...req.body } : e));
  saveData(expenses);
  res.json({ message: "Expense updated" });
});

app.delete("/api/expenses/:id", (req, res) => {
  saveData(readData().filter((e) => e.id !== req.params.id));
  res.json({ message: "Expense deleted" });
});

app.use("/api/budget", budgetRoutes);

app.listen(5000, () => console.log("Server running on port 5000"));
