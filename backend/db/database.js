const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.join(__dirname, "construction.db");

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Database connection failed ❌", err.message);
  } else {
    console.log("Connected to SQLite database ✅");
  }
});

db.serialize(() => {

  // ================= PROJECTS TABLE
  db.run(`
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      location TEXT NOT NULL,
      minBudget REAL NOT NULL,
      maxBudget REAL NOT NULL,
      floors INTEGER NOT NULL,
      area REAL NOT NULL,
      parking TEXT,
      amenities TEXT,
      start_date TEXT NOT NULL,
      end_date TEXT NOT NULL,
      duration REAL,
      description TEXT,
      status TEXT DEFAULT 'Active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // ================= CLIENTS TABLE
  db.run(`
    CREATE TABLE IF NOT EXISTS clients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      co_owner TEXT,
      phone TEXT,
      address TEXT,
      project TEXT,
      floor TEXT,
      room TEXT,
      amount_paid REAL,
      payment_mode TEXT,
      bank_name TEXT,
      cheque_no TEXT,
      amenities TEXT,
      installments TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // ================= WORKERS TABLE
  db.run(`
    CREATE TABLE IF NOT EXISTS workers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      phone TEXT,
      email TEXT,
      role TEXT,
      assigned_project TEXT,
      skill_type TEXT,
      experience INTEGER,
      address TEXT,
      current_status TEXT,
      joined TEXT,
      wage_type TEXT,
      daily_wage REAL,
      monthly_wage REAL,
      salary REAL,
      category TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // ================= ATTENDANCE TABLE
  db.run(`
    CREATE TABLE IF NOT EXISTS attendance (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      worker_id INTEGER,
      date TEXT,
      status TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // ================= MATERIALS TABLE
  db.run(`
    CREATE TABLE IF NOT EXISTS materials (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      quantity REAL,
      unit TEXT,
      supplier TEXT,
      purchaseDate TEXT,
      costPerUnit REAL,
      totalCost REAL,
      project TEXT,
      bill TEXT,
      remarks TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) console.log("Materials table error ❌", err.message);
    else console.log("Materials table ready ✅");
  });

  // ================= EXPENSES TABLE
  db.run(`
    CREATE TABLE IF NOT EXISTS expenses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      type TEXT,
      amount REAL,
      paymentMethod TEXT,
      date TEXT,
      project TEXT,
      paidTo TEXT,
      bill TEXT,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) console.log("Expenses table error ❌", err.message);
    else console.log("Expenses table ready ✅");
  });

  // ================= PAYMENTS TABLE
  db.run(`
    CREATE TABLE IF NOT EXISTS payments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,

      title TEXT,
      clientName TEXT,
      projectName TEXT,

      transactionFlow TEXT,
      paymentType TEXT,

      milestoneName TEXT,
      milestonePercent TEXT,

      totalAmount REAL,
      paidAmount REAL,
      pendingAmount REAL,

      gstPercent REAL,
      gstAmount REAL,

      tdsPercent REAL,
      tdsAmount REAL,

      finalAmount REAL,

      paymentDate TEXT,
      dueDate TEXT,

      paymentMethod TEXT,
      transactionId TEXT,

      status TEXT,
      approvalStatus TEXT,

      createdByRole TEXT,
      approvedBy TEXT,

      supplierName TEXT,
      workerName TEXT,

      invoiceFile TEXT,
      notes TEXT
    )
  `, (err) => {
    if (err) console.log("Payments table error ❌", err.message);
    else console.log("Payments table ready ✅");
  });

});

  // ================= REPORTS TABLE (FOR REPORT HISTORY)
  db.run(`
    CREATE TABLE IF NOT EXISTS reports (
      id INTEGER PRIMARY KEY AUTOINCREMENT,

      report_type TEXT NOT NULL,
      category TEXT NOT NULL,

      start_date TEXT NOT NULL,
      end_date TEXT NOT NULL,

      generated_by TEXT,
      file_name TEXT,

      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) console.log("Reports table error ❌", err.message);
    else console.log("Reports table ready ✅");
  });
module.exports = db;