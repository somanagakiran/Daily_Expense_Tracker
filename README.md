# Daily Expense Tracker

Full-stack expense tracker built with **React (Vite)** and **Node.js + Express**. Data is stored in a JSON file (no database needed).

## How to run

```bash
git clone <repo-url>
cd <project-folder>
npm install
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:5000/api/expenses

## Features

- Add, edit and delete expenses (description, amount, category, date, payment mode, note)
- Total, this month, today and highest expense cards
- Monthly budget with progress bar (saved in the browser)
- Category-wise spending and last 7 days chart
- Search, filter by category / month, sort
- Export to CSV
- Dark mode
- Input validation on both frontend and backend

## Folder structure

```
server.js               - Express server and expense APIs
utils/db.js             - getAll / add / update / remove (JSON file)
utils/validate.js       - validation middleware (400 / 404 errors)
data/expenses.json      - stored expenses
src/App.jsx             - main React component
src/main.jsx            - React entry point
src/api.js              - fetch helpers for add / update
src/utils.js            - formatting and helper functions
src/components/         - Navbar, Summary, ExpenseForm, ExpenseList
src/style.css           - styles
```

## APIs

| Method | URL | Use |
|---|---|---|
| GET | /api/expenses | Get all expenses |
| POST | /api/expenses | Add expense |
| PUT | /api/expenses/:id | Update expense |
| DELETE | /api/expenses/:id | Delete expense |
