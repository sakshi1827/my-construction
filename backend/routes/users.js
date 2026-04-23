const express = require("express");
const router = express.Router(); // 
const db = require("../db/database");


// ✅ GET USERS
router.get("/", (req, res) => {
  db.all("SELECT * FROM users", [], (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});


// ✅ ADD USER
router.post("/", (req, res) => {
  const { username, password } = req.body;

  db.run(
    "INSERT INTO users (username, password) VALUES (?, ?)",
    [username, password],
    function (err) {
      if (err) {
        console.log(err);
        return res.json({ success: false });
      }

      res.json({ success: true });
    }
  );
});


// ✅ LOGIN USER
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  const sql = "SELECT * FROM users WHERE username = ? AND password = ?";

  db.get(sql, [username, password], (err, row) => {
    if (err) return res.status(500).json(err);

    if (!row) {
      return res.json({ success: false });
    }

    res.json({ success: true, user: row });
  });
});

module.exports = router; 