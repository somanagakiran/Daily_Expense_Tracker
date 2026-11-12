import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Summary from "./components/Summary";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";

function App() {
  const [expenses, setExpenses] = useState([]);
  const [editItem, setEditItem] = useState(null);

  const loadExpenses = async () => {
    const res = await fetch("/api/expenses");
    setExpenses(await res.json());
  };

  const deleteExpense = async (id) => {
    await fetch("/api/expenses/" + id, { method: "DELETE" });
    loadExpenses();
  };

  useEffect(() => {
    loadExpenses();
  }, []);

  return (
    <div>
      <Navbar />
      <Summary expenses={expenses} />
      <ExpenseForm editItem={editItem} setEditItem={setEditItem} loadExpenses={loadExpenses} />
      <ExpenseList expenses={expenses} setEditItem={setEditItem} deleteExpense={deleteExpense} />
    </div>
  );
}

export default App;
