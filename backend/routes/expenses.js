const express = require("express");
const router = express.Router();
const db = require("../db/database");

// ================= ADD EXPENSE
router.post("/", (req, res) => {
  console.log("EXPENSE BODY:", req.body);

  const {
    title,
    type,
    amount,
    paymentMethod,
    date,
    project,
    paidTo,
    bill,
    notes
  } = req.body;

  // validation
  if (!title || !amount) {
    return res.status(400).json({
      message: "Title and Amount are required"
    });
  }

  const sql = `
    INSERT INTO expenses
    (title, type, amount, paymentMethod, date, project, paidTo, bill, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(
    sql,
    [
      title,
      type,
      Number(amount),
      paymentMethod,
      date,
      project,
      paidTo,
      bill,
      notes
    ],
    function (err) {
      if (err) {
        console.log("DB ERROR:", err);
        return res.status(500).json({
          message: "Database error",
          error: err.message
        });
      }

      res.json({
        message: "Expense saved successfully ✅",
        id: this.lastID
      });
    }
  );
});

// ================= GET ALL EXPENSES
router.get("/", (req, res) => {
  db.all(
    "SELECT * FROM expenses ORDER BY id DESC",
    [],
    (err, rows) => {
      if (err) {
        return res.status(500).json({
          message: "Database error",
          error: err.message
        });
      }

      res.json(rows);
    }
  );
});

module.exports = router;