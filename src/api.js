// All calls to the Express backend live here.
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
  list: () => request("/api/expenses"),
  add: (expense) => request("/api/expenses", { method: "POST", body: expense }),
  update: (id, expense) => request(`/api/expenses/${id}`, { method: "PUT", body: expense }),
  remove: (id) => request(`/api/expenses/${id}`, { method: "DELETE" }),
  getBudget: () => request("/api/budget"),
  setBudget: (monthlyBudget) => request("/api/budget", { method: "PUT", body: { monthlyBudget } }),
};
