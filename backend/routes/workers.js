const express = require("express");
const router = express.Router();
const db = require("../db/database");


// ================= GET ALL WORKERS
router.get("/", (req, res) => {
db.all("SELECT * FROM workers ORDER BY id DESC", [], (err, rows) => {
if (err) return res.status(500).json(err);
res.json(rows);
});
});


// ================= ADD WORKER
router.post("/", (req, res) => {

const {
name,
phone,
email,
role,
assigned_project,
skill_type,
experience,
address,
current_status,
joined,
wage_type,
daily_wage,
monthly_wage,
salary,
category
} = req.body;

const sql = `
INSERT INTO workers
(name, phone, email, role, assigned_project, skill_type, experience, address, current_status, joined, wage_type, daily_wage, monthly_wage, salary, category)
VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
`;

db.run(sql, [
name,
phone,
email,
role,
assigned_project,
skill_type,
experience,
address,
current_status,
joined,
wage_type,
daily_wage,
monthly_wage,
salary,
category
], function (err) {

if (err) return res.status(500).json(err);

// IMPORTANT: return full inserted data
res.json({
id: this.lastID,
name,
phone,
email,
role,
assigned_project,
skill_type,
experience,
address,
current_status,
joined,
wage_type,
daily_wage,
monthly_wage,
salary,
category
});

});
});
// ================= UPDATE WORKER
router.put("/:id", (req, res) => {

const {
name,
phone,
email,
role,
assigned_project,
skill_type,
experience,
address,
current_status,
joined,
wage_type,
daily_wage,
monthly_wage,
salary,
category
} = req.body;

const sql = `
UPDATE workers SET
name=?, phone=?, email=?, role=?, assigned_project=?, skill_type=?,
experience=?, address=?, current_status=?, joined=?,
wage_type=?, daily_wage=?, monthly_wage=?, salary=?, category=?
WHERE id=?
`;

db.run(sql, [
name,
phone,
email,
role,
assigned_project,
skill_type,
experience,
address,
current_status,
joined,
wage_type,
daily_wage,
monthly_wage,
salary,
category,
req.params.id
], function(err){
if (err) return res.status(500).json(err);
res.json({ success:true });
});
});

// ================= DELETE WORKER
router.delete("/:id", (req, res) => {
db.run("DELETE FROM workers WHERE id=?", [req.params.id], function (err) {
if (err) return res.status(500).json(err);
res.json({ success: true });
});
});

module.exports = router;