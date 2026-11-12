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
