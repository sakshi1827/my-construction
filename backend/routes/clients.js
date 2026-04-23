const express = require("express");
const router = express.Router();
const db = require("../db/database");

// ================= GET =================
router.get("/", (req, res) => {
  db.all("SELECT * FROM clients ORDER BY id DESC", [], (err, rows) => {
    if (err) return res.status(500).json(err);

    // convert installments back to array
    const formatted = rows.map(c => ({
      ...c,
      _id: c.id,
      installments: c.installments ? JSON.parse(c.installments) : []
    }));

    res.json(formatted);
  });
});

// ================= ADD =================
router.post("/", (req, res) => {
  const {
    name, co_owner, phone, address,
    project, floor, room,
    amount_paid, payment_mode,
    bank_name, cheque_no,
    amenities, installments
  } = req.body;

  const sql = `
    INSERT INTO clients 
    (name, co_owner, phone, address, project, floor, room,
     amount_paid, payment_mode, bank_name, cheque_no, amenities, installments)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)
  `;

  db.run(sql, [
    name,
    co_owner,
    phone,
    address,
    project,
    floor,
    room,
    amount_paid,
    payment_mode,
    bank_name,
    cheque_no,
    amenities,
    JSON.stringify(installments || [])
  ], function(err){
    if (err) return res.status(500).json(err);

    res.json({ id: this.lastID });
  });
});

// ================= UPDATE =================
router.put("/:id", (req, res) => {
  const {
    name, co_owner, phone, address,
    project, floor, room,
    amount_paid, payment_mode,
    bank_name, cheque_no,
    amenities, installments
  } = req.body;

  const sql = `
    UPDATE clients SET
      name=?, co_owner=?, phone=?, address=?,
      project=?, floor=?, room=?,
      amount_paid=?, payment_mode=?,
      bank_name=?, cheque_no=?, amenities=?, installments=?
    WHERE id=?
  `;

  db.run(sql, [
    name,
    co_owner,
    phone,
    address,
    project,
    floor,
    room,
    amount_paid,
    payment_mode,
    bank_name,
    cheque_no,
    amenities,
    JSON.stringify(installments || []),
    req.params.id
  ], function(err){
    if (err) return res.status(500).json(err);
    res.json({ success: true });
  });
});

// ================= DELETE =================
router.delete("/:id", (req, res) => {
  db.run("DELETE FROM clients WHERE id=?", [req.params.id], function(err){
    if (err) return res.status(500).json(err);
    res.json({ success: true });
  });
});

module.exports = router;