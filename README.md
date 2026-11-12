# 💰 Daily Expense Tracker

A full-stack expense tracker built with **React (Vite)** on the frontend and **Node.js + Express** on the backend. Data is stored in a JSON file, so no database setup is needed.

## Run

```bash
git clone <repo-url>
cd Daily_Expense_Tracker
npm install
npm run dev
```

- Frontend: http://localhost:5173 (opens automatically)
- Backend API: http://localhost:5000/api/expenses

`node_modules` is committed, so `npm install` also works **without internet** on Windows.

## Features

- Add, edit and delete expenses (description, amount, category, date, payment mode, note)
- Dashboard cards: total spent, this month, today, biggest expense
- Monthly budget with a colour-coded progress bar (green / orange / red)
- Category donut chart and last-7-days bar chart (pure SVG/CSS, no chart library)
- Search, filter by category and month, and sort by date or amount
- Export the filtered list to CSV (opens in Excel)
- Dark / light mode, toast notifications, responsive mobile layout
- Server-side validation with clear error messages

## Project structure

```
server.js                         ← backend entry (main code)
routes/expenseRoutes.js           ← API routes
controllers/expenseController.js  ← validation + business logic
utils/db.js                       ← JSON file read/write
data/expenses.json, settings.json ← stored data
src/App.jsx                       ← frontend entry (main code)
src/main.jsx                      ← React bootstrap
src/api.js, src/utils.js          ← API calls + helpers
src/components/                   ← Header, Summary, ExpenseForm, ExpenseList, EditModal
src/style.css                     ← styles
```

## API

| Method | URL | Purpose |
|---|---|---|
| GET | /api/expenses | List expenses (`?category=&month=&search=`) |
| GET | /api/expenses/stats | Totals and per-category for a month |
| GET | /api/expenses/:id | One expense |
| POST | /api/expenses | Add expense |
| PUT | /api/expenses/:id | Update expense |
| DELETE | /api/expenses/:id | Delete expense |
| GET / PUT | /api/budget | Read / set monthly budget |
