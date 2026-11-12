const express = require("express");
const cors = require("cors");
const routes = require("./routes/expenseRoutes");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api", routes);

app.listen(5000, () => console.log("Server running on http://localhost:5000"));
