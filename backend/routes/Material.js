const express = require("express");
const router = express.Router();
const db = require("../db/database");

// ================= ADD MATERIAL
router.post("/", (req, res) => {
  console.log("MATERIAL BODY:", req.body);

  const {
    name,
    quantity,
    unit,
    supplier,
    purchaseDate,
    costPerUnit,
    project,
    bill,
    remarks
  } = req.body;

  // ================= VALIDATION
  if (!name || !quantity || !costPerUnit) {
    return res.status(400).json({
      message: "Missing required fields (name, quantity, costPerUnit required)"
    });
  }

  // ================= SAFE NUMBER CONVERSION
  const qty = Number(quantity);
  const cost = Number(costPerUnit);

  if (isNaN(qty) || isNaN(cost)) {
    return res.status(400).json({
      message: "Quantity and Cost must be valid numbers"
    });
  }

  // ================= SERVER-SIDE CALCULATION (IMPORTANT FIX)
  const totalCost = qty * cost;

  const sql = `
    INSERT INTO materials
    (name, quantity, unit, supplier, purchaseDate, costPerUnit, totalCost, project, bill, remarks)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(
    sql,
    [
      name,
      qty,
      unit,
      supplier,
      purchaseDate,
      cost,
      totalCost,
      project,
      bill,
      remarks
    ],
    function (err) {
      if (err) {
        console.log("DB ERROR ❌:", err.message);
        return res.status(500).json({
          message: "Database error",
          error: err.message
        });
      }

      res.json({
        message: "Material saved successfully ✅",
        id: this.lastID,
        totalCost
      });
    }
  );
});

// ================= GET ALL MATERIALS
router.get("/", (req, res) => {
  db.all(
    "SELECT * FROM materials ORDER BY id DESC",
    [],
    (err, rows) => {
      if (err) {
        console.log("DB ERROR ❌:", err.message);
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