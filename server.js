const express = require("express");
const cors = require("cors");
const db = require("./utils/db");
const validate = require("./utils/validate");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/expenses", validate);

app.get("/api/expenses", (req, res) => {
  res.json(db.getAll());
});

app.post("/api/expenses", (req, res) => {
  res.json(db.add(req.body));
});

app.put("/api/expenses/:id", (req, res) => {
  res.json(db.update(req.params.id, req.body));
});

app.delete("/api/expenses/:id", (req, res) => {
  res.json(db.remove(req.params.id));
});

app.listen(5000, () => console.log("Server running on port 5000"));
