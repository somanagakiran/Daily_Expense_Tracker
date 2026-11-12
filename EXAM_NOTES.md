# FSD-2 External Lab — Daily Expense Tracker

## AIM
To develop a full-stack **Daily Expense Tracker** web application using **React.js** for the frontend and **Node.js with Express.js** for the backend. The user can add, view, edit and delete daily expenses and see the total amount spent. The project is managed using **Git and GitHub**.

## PROCEDURE
1. Install Node.js, Git and VS Code.
2. Create a project folder, open it in VS Code and run `npm init -y`.
3. Install the packages:
   `npm install express cors react react-dom`
   `npm install -D vite @vitejs/plugin-react concurrently`
4. Create `server.js` (backend) using Express. Use the `cors()` and `express.json()` middleware.
5. Write REST APIs in server.js:
   - `GET /api/expenses` → view all expenses
   - `POST /api/expenses` → add an expense
   - `PUT /api/expenses/:id` → update an expense
   - `DELETE /api/expenses/:id` → delete an expense
   The data is stored in the `data/expenses.json` file.
6. Create `src/App.jsx` (frontend). Use `useState` to store the expenses and `useEffect` + `fetch()` to load them from the backend.
7. Create the components `Navbar`, `Summary`, `ExpenseForm` and `ExpenseList`, and pass data and functions to them using props.
8. In `vite.config.js`, set a proxy so that `/api` requests go to `http://localhost:5000`.
9. Push the code to GitHub:
   ```
   git init
   git add .
   git commit -m "Daily Expense Tracker"
   git remote add origin <repository-url>
   git push -u origin main
   ```
10. In the lab, clone and run:
   ```
   git clone <repository-url>
   cd <project-folder>
   npm install
   npm run dev
   ```
11. Open `http://localhost:5173` in the browser and test adding, editing and deleting expenses.

## MAIN CODE — FRONTEND (src/App.jsx)
```jsx
import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Summary from "./components/Summary";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";

function App() {
  const [expenses, setExpenses] = useState([]);
  const [editItem, setEditItem] = useState(null);

  const loadExpenses = () => {
    fetch("/api/expenses")
      .then((res) => res.json())
      .then((data) => setExpenses(data));
  };

  useEffect(() => {
    loadExpenses();
  }, []);

  const deleteExpense = async (id) => {
    if (!window.confirm("Delete this expense?")) return;
    await fetch(`/api/expenses/${id}`, { method: "DELETE" });
    loadExpenses();
  };

  const total = expenses.reduce((sum, e) => sum + Number(e.amount), 0);

  return (
    <>
      <Navbar />
      <div className="container">
        <Summary expenses={expenses} total={total} />
        <ExpenseForm editItem={editItem} setEditItem={setEditItem} onSave={loadExpenses} />
        <ExpenseList expenses={expenses} onEdit={setEditItem} onDelete={deleteExpense} />
      </div>
    </>
  );
}

export default App;
```

## MAIN CODE — BACKEND (server.js)
```js
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
```

## EXPECTED OUTPUT
1. The terminal shows `Server running on port 5000` and `VITE ready — Local: http://localhost:5173`.
2. The browser opens the Daily Expense Tracker page. It has a navbar and four cards: Total Expenses, This Month, Today and Highest.
3. Enter an expense (for example: Lunch, ₹120, Food, today's date) and click **Add Expense**. A message says "Expense added", the expense appears in the table, and all the totals update.
4. Click **Edit**. The form fills with that expense. Change the amount and click **Update Expense**, and the table updates.
5. Click **Delete** and confirm. The expense is removed and the total decreases.
6. Below the table, the Monthly Budget progress bar, the Category-wise bars and the Last 7 Days chart show the spending.
7. Search, the category/month filters and sorting all work, and **Export CSV** downloads the list.
8. If the description is empty or the amount is 0, an error message is shown.
9. The data stays saved after the server restarts, because it is stored in `data/expenses.json`.

## ORIGINAL OUTPUT
(Write what you actually saw, for example:) The application ran successfully on http://localhost:5173. Expenses were added, edited and deleted successfully. The total, monthly and today's amounts were updated correctly, and the data was stored in the JSON file.

---

## HOW TO REMEMBER

### server.js — 6 blocks (top to bottom)
| # | Block | Key line |
|---|---|---|
| 1 | 5 requires | express, cors, `{ readData, saveData }`, validate, budgetRoutes |
| 2 | app + 2 middlewares | `app.use(cors())`, `app.use(express.json())` |
| 3 | **GET** | `res.json(readData())` |
| 4 | **POST** | validate → read → push newExpense (id = Date.now) → save → 201 |
| 5 | **PUT** | validate → read → findIndex → 404 if -1 → replace → save |
| 6 | **DELETE**, budget route and listen | filter out the id → save; `app.listen(5000)` |

Trick: **G-P-P-D** = Get, Post, Put, Delete (the same order as CRUD: Read, Create, Update, Delete).
POST and PUT both start with the same 2 lines: `const error = validate(req.body); if (error) return ...400`.

### App.jsx — 5 blocks
| # | Block | Key line |
|---|---|---|
| 1 | imports | 2 hooks + 4 components (Navbar, Summary, ExpenseForm, ExpenseList) |
| 2 | 2 states | `expenses` = `[]`, `editItem` = `null` |
| 3 | loadExpenses + useEffect | fetch → res.json() → setExpenses; useEffect with `[]` |
| 4 | deleteExpense + total | confirm → fetch DELETE → loadExpenses; `reduce` for total |
| 5 | return | Navbar, then container with Summary, ExpenseForm, ExpenseList |

Props trick: **Summary** gets *expenses + total*. **Form** gets *editItem, setEditItem, onSave*. **List** gets *expenses, onEdit, onDelete*.

---

## If something goes wrong in the lab
| Problem | Fix |
|---|---|
| `npm install` fails (no internet) | Ignore it and run `npm run dev`. `node_modules` is already in the repo. |
| `EADDRINUSE: port 5000` | Close the old terminal (Ctrl+C) or restart VS Code, then run again |
| Browser didn't open | Open http://localhost:5173 yourself |
| Page shows but no data | Check that the terminal shows `[server] Server running on port 5000` |
