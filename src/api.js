// fetch helpers used by ExpenseForm
async function request(url, options = {}) {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Something went wrong");
  return data;
}

export const api = {
  add: (expense) => request("/api/expenses", { method: "POST", body: expense }),
  update: (id, expense) => request(`/api/expenses/${id}`, { method: "PUT", body: expense }),
};
