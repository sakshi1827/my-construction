const express = require("express");
const router = express.Router();
const db = require("../db/database");

router.post("/", (req, res) => {

  const records = req.body;

  const sql = `
    INSERT OR REPLACE INTO attendance (worker_id, date, status)
    VALUES (?, ?, ?)
  `;

  records.forEach(record => {
    db.run(sql, [
      record.worker_id,
      record.date,
      record.status
    ]);
  });

  res.json({ message: "Attendance saved ✅" });
});

module.exports = router;