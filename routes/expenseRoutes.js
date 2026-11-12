const express = require("express");
const controller = require("../controllers/expenseController");

const router = express.Router();

// Expenses CRUD
router.get("/expenses", controller.getExpenses);
router.get("/expenses/stats", controller.getStats);
router.get("/expenses/:id", controller.getExpenseById);
router.post("/expenses", controller.addExpense);
router.put("/expenses/:id", controller.updateExpense);
router.delete("/expenses/:id", controller.deleteExpense);

// Monthly budget
router.get("/budget", controller.getBudget);
router.put("/budget", controller.setBudget);

module.exports = router;
