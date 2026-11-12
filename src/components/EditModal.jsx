import { useEffect } from "react";
import ExpenseForm from "./ExpenseForm";

export default function EditModal({ expense, onClose, onSaved }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="panel-head">
          <h3>✏️ Edit expense</h3>
          <button className="icon-btn small" onClick={onClose}>✕</button>
        </div>
        <ExpenseForm initial={{ note: "", payment: "Cash", ...expense }} onSave={onSaved} onCancel={onClose} />
      </div>
    </div>
  );
}
