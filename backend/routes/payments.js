const express = require("express");
const router = express.Router();
const db = require("../db/database");
const multer = require("multer");

// ================= BODY PARSER SAFE (IMPORTANT)
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

// ================= FILE UPLOAD
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

/* ================= GET ALL ================= */
router.get("/", (req, res) => {
  db.all("SELECT * FROM payments ORDER BY id DESC", [], (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});

/* ================= CREATE ================= */
router.post("/", upload.single("invoice"), (req, res) => {
  const data = req.body;

  if (!data.title && !data.clientName && !data.projectName) {
    return res.status(400).json({ message: "Empty form not allowed" });
  }

  db.run(
    `INSERT INTO payments (
      title, clientName, projectName,
      milestoneName,
      totalAmount, paidAmount, pendingAmount,
      paymentDate, dueDate,
      invoiceFile
    )
    VALUES (?,?,?,?,?,?,?,?,?,?)`,
    [
      data.title,
      data.clientName,
      data.projectName,
      data.milestoneName,
      data.totalAmount,
      data.paidAmount,
      data.pendingAmount,
      data.paymentDate,
      data.dueDate,
      req.file ? req.file.filename : null
    ],
    function (err) {
      if (err) return res.status(500).json(err);

      res.json({ id: this.lastID });
    }
  );
});

/* ================= UPDATE ================= */
router.put("/:id", upload.single("invoice"), (req, res) => {
  const data = req.body;

  db.run(
    `UPDATE payments SET
      title=?,
      clientName=?,
      projectName=?,
      milestoneName=?,
      totalAmount=?,
      paidAmount=?,
      pendingAmount=?,
      paymentDate=?,
      dueDate=?
    WHERE id=?`,
    [
      data.title,
      data.clientName,
      data.projectName,
      data.milestoneName,
      data.totalAmount,
      data.paidAmount,
      data.pendingAmount,
      data.paymentDate,
      data.dueDate,
      req.params.id
    ],
    function (err) {
      if (err) return res.status(500).json(err);

      if (this.changes === 0) {
        return res.status(404).json({ message: "Not found" });
      }

      res.json({ message: "updated", id: req.params.id });
    }
  );
});

/* ================= DELETE ================= */
router.delete("/:id", (req, res) => {
  const id = req.params.id;

  db.run("DELETE FROM payments WHERE id = ?", [id], function (err) {
    if (err) return res.status(500).json(err);

    if (this.changes === 0) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.json({ message: "deleted", id });
  });
});

module.exports = router;