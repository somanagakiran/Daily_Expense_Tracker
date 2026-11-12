# FSD-2 External Lab — Daily Expense Tracker (what to write on paper)

## AIM
To develop a full-stack **Daily Expense Tracker** web application using **React.js** (frontend) and **Node.js with Express.js** (backend) that allows a user to add, view, edit and delete daily expenses and view the total amount spent, and to manage the project using **Git**.

## PROCEDURE
1. Install Node.js, Git and VS Code on the system.
2. Create a project folder and initialise it with `npm init -y`.
3. Install the required packages: `npm install express cors react react-dom` and `npm install -D vite @vitejs/plugin-react concurrently`.
4. Create the backend file `server.js` using Express. Add the `cors` and `express.json()` middleware and connect the expense routes at `/api`.
5. Create REST APIs: GET (view), POST (add), PUT (edit) and DELETE (remove) expenses. Store the data in `data/expenses.json`.
6. Create the React frontend in `src/App.jsx`. Use `useState` to store the expenses and `useEffect` to fetch them from the backend using `fetch()`.
7. Create components for the form, the summary and the expense list, and pass data to them using props.
8. Configure the Vite proxy so that `/api` requests go to the backend on port 5000.
9. Push the project to GitHub using `git init`, `git add .`, `git commit`, `git remote add origin` and `git push`.
10. In the lab, clone the repository and run the app:
    ```
    git clone <repository-url>
    cd Daily_Expense_Tracker
    npm install
    npm run dev
    ```
11. Open `http://localhost:5173` in the browser. Add, edit and delete expenses and check that the total updates.

## MAIN CODE — FRONTEND (src/App.jsx)
```jsx
import { useEffect, useState } from "react";
import Header from "./components/Header";
import Summary from "./components/Summary";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";

function App() {
  const [expenses, setExpenses] = useState([]);

  const loadExpenses = () =>
    fetch("/api/expenses").then((res) => res.json()).then(setExpenses);

  useEffect(() => { loadExpenses(); }, []);

  return (
    <div className="container">
      <Header />
      <Summary expenses={expenses} />
      <ExpenseForm onSave={loadExpenses} />
      <ExpenseList expenses={expenses} onChange={loadExpenses} />
    </div>
  );
}

export default App;
```

## MAIN CODE — BACKEND (server.js)
```js
const express = require("express");
const cors = require("cors");
const routes = require("./routes/expenseRoutes");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api", routes);

app.listen(5000, () => console.log("Server running on http://localhost:5000"));
```

## EXPECTED OUTPUT
- The terminal shows `Server running on http://localhost:5000` and Vite running on `http://localhost:5173`.
- The browser opens the Daily Expense Tracker dashboard with these cards: Total spent, This month, Today and Biggest expense.
- When a new expense is added (for example "Lunch", ₹120, Food), it appears in the transactions table and all the totals update.
- Editing or deleting an expense updates the list and totals immediately.
- The monthly budget bar shows how much is spent and how much is left. The category chart shows the spending split.
- The data stays saved after the server restarts, because it is stored in `data/expenses.json`.

## ORIGINAL OUTPUT
(Write what you actually saw. For example: "The application ran successfully. Expenses were added, edited and deleted, and the totals were updated correctly.")

---

## Memory tips
**server.js = 5 steps:** require → create app → 2 middlewares (cors, json) → mount routes on `/api` → listen on 5000.

**App.jsx = 4 parts:** imports (2 hooks + 4 components) → `useState([])` → `loadExpenses` with fetch + `useEffect` → return 4 components inside a div.

## If something goes wrong in the lab
| Problem | Fix |
|---|---|
| `npm install` fails (no internet) | Ignore it and run `npm run dev`. `node_modules` is already in the repo. |
| `Port 5000 already in use` | Close the old terminal, or run `npx kill-port 5000` |
| Browser didn't open | Open http://localhost:5173 yourself |
| `'vite' is not recognized` | Run `npm install` again with internet |
