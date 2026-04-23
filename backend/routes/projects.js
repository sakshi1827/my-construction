const express = require("express");
const router = express.Router();
const db = require("../db/database");

// ================= GET ALL PROJECTS
router.get("/", (req, res) => {
  db.all("SELECT * FROM projects ORDER BY id DESC", [], (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});

// ================= ADD PROJECT
router.post("/", (req, res) => {
  const {
    name,
    location,
    minBudget,
    maxBudget,
    floors,
    area,
    parking,
    amenities,
    start_date,
    end_date,
    duration,
    description,
    status
  } = req.body;

  const sql = `
    INSERT INTO projects 
    (name, location, minBudget, maxBudget, floors, area, parking, amenities, start_date, end_date, duration, description, status)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)
  `;

  db.run(
    sql,
    [
      name,
      location,
      minBudget,
      maxBudget,
      floors,
      area,
      parking,
      amenities,
      start_date,
      end_date,
      duration,
      description,
      status || "Active"
    ],
    function (err) {
      if (err) return res.status(500).json(err);

      res.json({
        message: "Project added successfully ✅",
        id: this.lastID
      });
    }
  );
});
 // ================= UPDATE PROJECT
router.put("/:id", (req, res) => {
  const {
    name,
    location,
    minBudget,
    maxBudget,
    floors,
    area,
    parking,
    amenities,
    start_date,
    end_date,
    duration,
    description,
    status
  } = req.body;

  const sql = `
    UPDATE projects SET
      name=?,
      location=?,
      minBudget=?,
      maxBudget=?,
      floors=?,
      area=?,
      parking=?,
      amenities=?,
      start_date=?,
      end_date=?,
      duration=?,
      description=?,
      status=?
    WHERE id=?
  `;

  db.run(
    sql,
    [
      name,
      location,
      minBudget,
      maxBudget,
      floors,
      area,
      parking,
      amenities,
      start_date,
      end_date,
      duration,
      description,
      status,
      req.params.id
    ],
    function (err) {
      if (err) return res.status(500).json(err);
      res.json({ message: "Project updated successfully ✅" });
    }
  );
});

// ================= DELETE PROJECT
router.delete("/:id", (req, res) => {
  db.run("DELETE FROM projects WHERE id=?", [req.params.id], function (err) {
    if (err) return res.status(500).json(err);
    res.json({ success: true });
  });
});

module.exports = router; // ✅ IMPORTANT