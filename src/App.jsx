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
