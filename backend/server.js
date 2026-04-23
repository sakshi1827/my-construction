const express =require("express");
const cors = require("cors");
const router = express.Router();

const app = express();


require("./db/database");


app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

app.use(express.json());

// test route
router.get("/", (req, res) => {
  res.send("Material API working ✅");
});
/*app.get("/", (req, res) => {
  res.json({ message: "API Running " });
});*/

// ================= ROUTES
const workers = require("./routes/workers");
const projects = require("./routes/projects");
const clients = require("./routes/clients");
const users = require("./routes/users");
const attendance = require("./routes/attendance");
const expenses = require("./routes/expenses");
const Materials = require("./routes/Material");
const payments = require("./routes/payments");
//const reports = require("./routes/report");

// ================= USE ROUTES
app.use("/api/workers", workers);
app.use("/api/projects", projects);
app.use("/api/clients", clients);
app.use("/api/users", users);
app.use("/api/attendance", attendance);
app.use("/api/expenses", expenses);
app.use("/api/material", Materials);
app.use("/api/payments", payments);
//app.use("/api/report", reports);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const PORT = 5000;

app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});
module.exports = router;