import { useState, useEffect } from "react"; 
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

function WorkerManagement() {

const today = new Date().toISOString().split("T")[0];

// ================= ROLES SEPARATE
const employeeRoles = [
 "Project Manager",
 "Site Manager",
 "Site Supervisor",
 "Site Engineer",
 "Project Engineer",
 "Junior Engineer",
 "Senior Engineer",
 "Quantity Surveyor",
 "Architect",
 "Interior Designer",
 "Safety Officer",
 "HR Executive",
 "Accountant",
 "Admin Officer",
 "Store Incharge",
 "Procurement Officer"
];

const workerRoles = [
 "Mason",
 "Carpenter",
 "Electrician",
 "Plumber"
];

const [workers, setWorkers] = useState([]);
const [projects, setProjects] = useState([]);
const [showForm, setShowForm] = useState(false);
const [editId, setEditId] = useState(null);

const [formData, setFormData] = useState({
name: "",
phone: "",
email: "",
role: "",
project: "",
experience: "",
address: "",
currentStatus: "Available",
joined: today,

category: "Worker",
wageType: "Daily",
dailyWage: "",
monthlyWage: "",
skillType: "",
salary: ""
});

// ================= FETCH WORKERS
const fetchWorkers = async () => {
try {
const res = await fetch("http://localhost:5000/api/workers");
const data = await res.json();
setWorkers(Array.isArray(data) ? data : []);
} catch (err) {
console.error(err);
setWorkers([]);
}
};

// ================= FETCH PROJECTS
const fetchProjects = async () => {
try {
const res = await fetch("http://localhost:5000/api/projects");
const data = await res.json();
setProjects(Array.isArray(data) ? data : []);
} catch (err) {
console.error(err);
}
};

useEffect(() => {
fetchWorkers();
fetchProjects();
}, []);

// ================= HANDLE CHANGE
const handleChange = (e) => {
const { name, value } = e.target;

// validations
if (name === "name" && !/^[A-Za-z\s]*$/.test(value)) return;
if (name === "phone" && !/^\d{0,10}$/.test(value)) return;
if (name === "email" && (value.match(/@/g) || []).length > 1) return;
if (name === "address" && !/^[A-Za-z0-9\s]*$/.test(value)) return;
if (name === "experience" && (value < 0 || value > 20)) return;
if (["salary", "dailyWage", "monthlyWage"].includes(name) && value < 0) return;

// category change resets role
if (name === "category") {
setFormData({
...formData,
category: value,
role: ""
});
return;
}

setFormData({ ...formData, [name]: value });
};
useEffect(() => {
  // Employee salary stays manual
  if (formData.category === "Employee") return;

  // Worker calculation
  if (formData.category === "Worker") {

    // Monthly worker
    if (formData.wageType === "Monthly") {
      setFormData(prev => ({
        ...prev,
        salary: prev.monthlyWage || ""
      }));
    }

    // Daily worker (assume 26 working days)
    if (formData.wageType === "Daily") {
      const days = 26; // standard
      const total = Number(formData.dailyWage || 0) * days;

      setFormData(prev => ({
        ...prev,
        salary: total || ""
      }));
    }
  }

}, [formData.dailyWage, formData.monthlyWage, formData.wageType, formData.category]);
// ================= SUBMIT
const handleSubmit = async (e) => {
e.preventDefault();

try {
const url = editId
? `http://localhost:5000/api/workers/${editId}`
: "http://localhost:5000/api/workers";

const method = editId ? "PUT" : "POST";

await fetch(url, {
method,
headers: { "Content-Type": "application/json" },
body: JSON.stringify({
name: formData.name,
phone: formData.phone,
email: formData.email,
role: formData.role,
assigned_project: formData.project,
experience: formData.experience,
address: formData.address,
current_status: formData.currentStatus,
joined: formData.joined,

category: formData.category,
wage_type: formData.wageType,
daily_wage: formData.dailyWage,
monthly_wage: formData.monthlyWage,
skill_type: formData.skillType,
salary: formData.salary
})
});

await fetchWorkers();

setShowForm(false);
setEditId(null);

} catch (err) {
console.error(err);
alert("Save failed");
}
};

// ================= DELETE
const handleDelete = async (id) => {
if (!window.confirm("Delete worker?")) return;

try {
await fetch(`http://localhost:5000/api/workers/${id}`, {
method: "DELETE"
});

await fetchWorkers();

} catch (err) {
console.error(err);
}
};

// ================= EDIT
const handleEdit = (w) => {
setFormData({
name: w.name || "",
phone: w.phone || "",
email: w.email || "",
role: w.role || "",
project: w.assigned_project || "",
experience: w.experience || "",
address: w.address || "",
currentStatus: w.current_status || "Available",
joined: w.joined || today,

category: w.category || "Worker",
wageType: w.wage_type || "Daily",
dailyWage: w.daily_wage || "",
monthlyWage: w.monthly_wage || "",
skillType: w.skill_type || "",
salary: w.salary || ""
});

setEditId(w._id || w.id);
setShowForm(true);
};

// ================= ROLE SELECT LOGIC
const getRoleOptions = () => {
return formData.category === "Employee" ? employeeRoles : workerRoles;
};

// ================= UI
return (
<div className="flex bg-gray-100 min-h-screen">
<Sidebar />

<div className="flex-1 p-6">
<Topbar />

{showForm ? (
<div className="bg-white rounded-xl shadow p-8 mt-6">

<h2 className="text-2xl font-semibold mb-6">
{editId ? "Edit" : "Add"}
</h2>

<form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">

{/* CATEGORY */}
<div className="col-span-2">
<label>Type</label>
<select name="category" value={formData.category} onChange={handleChange} className="border p-3 rounded w-full">
<option value="Employee">Employee</option>
<option value="Worker">Worker</option>
</select>
</div>

{/* NAME */}
<div>
<label>Name</label>
<input name="name" value={formData.name} onChange={handleChange} className="border p-3 rounded w-full" />
</div>

{/* PHONE */}
<div>
<label>Phone</label>
<input name="phone" value={formData.phone} onChange={handleChange} className="border p-3 rounded w-full" />
</div>

{/* EMAIL */}
<div>
<label>Email</label>
<input name="email" value={formData.email} onChange={handleChange} className="border p-3 rounded w-full" />
</div>

{/* ROLE (DYNAMIC FIX) */}
<div>
<label>Role</label>
<select name="role" value={formData.role} onChange={handleChange} className="border p-3 rounded w-full">
<option value="">Select Role</option>
{getRoleOptions().map(r => (
<option key={r} value={r}>{r}</option>
))}
</select>
</div>

{/* PROJECT */}
<div>
<label>Project</label>
<select name="project" value={formData.project} onChange={handleChange} className="border p-3 rounded w-full">
<option value="">Select</option>
{projects.map(p => (
<option key={p.id || p._id} value={p.name}>{p.name}</option>
))}
</select>
</div>

{/* EXPERIENCE */}
<div>
<label>Experience</label>
<input type="number" name="experience" value={formData.experience} onChange={handleChange} className="border p-3 rounded w-full" />
</div>

{/* ADDRESS */}
<div className="col-span-2">
<label>Address</label>
<input name="address" value={formData.address} onChange={handleChange} className="border p-3 rounded w-full" />
</div>

{/* EMPLOYEE SALARY */}
{formData.category === "Employee" && (
<div>
<label>Salary</label>
<input type="number" name="salary" value={formData.salary} onChange={handleChange} className="border p-3 rounded w-full" />
</div>
)}

{/* WORKER FIELDS */}
{formData.category === "Worker" && (
<>
<div>
<label>Wage Type</label>
<select name="wageType" value={formData.wageType} onChange={handleChange} className="border p-3 rounded w-full">
<option value="Daily">Daily</option>
<option value="Monthly">Monthly</option>
</select>
</div>

<div>
<label>Wage</label>
{formData.wageType === "Daily" ? (
<input type="number" name="dailyWage" value={formData.dailyWage} onChange={handleChange} className="border p-3 rounded w-full" />
) : (
<input type="number" name="monthlyWage" value={formData.monthlyWage} onChange={handleChange} className="border p-3 rounded w-full" />
)}
</div>

<div className="col-span-2">
<label>Skill Type</label>
<select name="skillType" value={formData.skillType} onChange={handleChange} className="border p-3 rounded w-full">
<option value="Mason">Mason</option>
<option value="Carpenter">Carpenter</option>
<option value="Electrician">Electrician</option>
<option value="Plumber">Plumber</option>
</select>
</div>
</>
)}

{/* BUTTONS */}
<button className="bg-orange-500 text-white px-6 py-2 rounded">Save</button>
<button type="button" onClick={() => setShowForm(false)} className="border px-6 py-2 rounded">Cancel</button>

</form>
</div>
) : (
<>
<div className="flex justify-between mt-6">
<h1 className="text-3xl font-bold">Worker Management</h1>
<button onClick={() => setShowForm(true)} className="bg-orange-500 text-white px-5 py-2 rounded">
+ Add
</button>
</div>

<table className="w-full mt-6 bg-white shadow">
<thead>
<tr>
<th>Name</th>
<th>Phone</th>
<th>Type</th>
<th>Role</th>
<th>Actions</th>
</tr>
</thead>

<tbody>
{workers.map(w => (
<tr key={w._id || w.id}>
<td>{w.name}</td>
<td>{w.phone}</td>
<td>{w.category}</td>
<td>{w.role}</td>
<td>
<button onClick={() => handleEdit(w)}>Edit</button>
<button onClick={() => handleDelete(w._id || w.id)}>Delete</button>
</td>
</tr>
))}
</tbody>

</table>
</>
)}

</div>
</div>
);
}

export default WorkerManagement; 