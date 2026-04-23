import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function ClientManagement() {

const [showForm,setShowForm] = useState(false);
const [clients,setClients] = useState([]);
const [projects,setProjects] = useState([]);
const [search,setSearch] = useState("");
const [editId,setEditId] = useState(null);

const [formData,setFormData] = useState({
name:"",
co_owner:"",
phone:"",
address:"",
project:"",
floor:"",
room:"",
amount_paid:"",
payment_mode:"",
bank_name:"",
cheque_no:"",
amenities:"", // ✅ ADDED
installments:[]
});

// ================= FETCH CLIENTS =================
const fetchClients = async ()=>{
try{
const res = await fetch("http://localhost:5000/api/clients");
const data = await res.json();
setClients(data);
}catch(err){
console.log("FETCH CLIENT ERROR:", err);
}
};

// ================= FETCH PROJECTS =================
const fetchProjects = async ()=>{
try{
const res = await fetch("http://localhost:5000/api/projects");
const data = await res.json();
setProjects(data);
}catch(err){
console.log(err);
}
};

useEffect(()=>{
fetchClients();
fetchProjects();
},[]);

// ================= PROJECT =================
const selectedProject = projects.find(
p => p.name === formData.project
);

// ================= ROOMS =================
const generateRooms = (floor)=>{
if(!floor || !selectedProject) return [];

let rooms=[];
const totalRooms = selectedProject.roomsPerFloor || 10;

for(let i=1;i<=totalRooms;i++){
rooms.push(`${floor}${i.toString().padStart(2,"0")}`);
}
return rooms;
};

// ================= HANDLE INPUT =================
const handleChange = (e)=>{
const {name,value} = e.target;

if(name==="name" || name==="co_owner"){
setFormData({
...formData,
[name]: value.replace(/[^a-zA-Z\s]/g,"")
});
return;
}

if(name==="bank_name"){
setFormData({
...formData,
bank_name: value.replace(/[^a-zA-Z\s]/g,"")
});
return;
}

if(name==="cheque_no"){
setFormData({
...formData,
cheque_no: value.replace(/\D/g,"")
});
return;
}

if(name==="address"){
setFormData({
...formData,
address: value.replace(/[^a-zA-Z0-9\s]/g,"")
});
return;
}

if(name==="phone"){
const numeric = value.replace(/\D/g,"");
if(numeric.length<=10){
setFormData({...formData,phone:numeric});
}
return;
}

setFormData({...formData,[name]:value});
};

// ================= AMENITIES =================
const handleAmenityChange = (item, checked)=>{
let arr = formData.amenities ? formData.amenities.split(",") : [];

if(checked){
arr.push(item);
}else{
arr = arr.filter(a => a !== item);
}

setFormData({...formData, amenities: arr.join(",")});
};

// ================= INSTALLMENTS =================
const addInstallment = ()=>{
setFormData({
...formData,
installments:[...formData.installments,{amount:"",date:""}]
});
};

const handleInstallmentChange = (index,field,value)=>{
const updated = [...formData.installments];
updated[index][field]=value;
setFormData({...formData,installments:updated});
};

// ================= SAVE =================
const handleSubmit = async ()=>{
try{

const url = editId
? `http://localhost:5000/api/clients/${editId}`
: "http://localhost:5000/api/clients";

const method = editId ? "PUT" : "POST";

const res = await fetch(url,{
method,
headers:{"Content-Type":"application/json"},
body:JSON.stringify(formData)
});

if(!res.ok){
throw new Error("Save failed");
}

await fetchClients();

setShowForm(false);
setEditId(null);

setFormData({
name:"",
co_owner:"",
phone:"",
address:"",
project:"",
floor:"",
room:"",
amount_paid:"",
payment_mode:"",
bank_name:"",
cheque_no:"",
amenities:"",
installments:[]
});

}catch(err){
console.log("SAVE ERROR:", err);
}
};

// ================= DELETE =================
const handleDelete = async (id)=>{
try{
const res = await fetch(
`http://localhost:5000/api/clients/${id}`,
{ method:"DELETE" }
);

if(!res.ok){
throw new Error("Delete failed");
}

await fetchClients();

}catch(err){
console.log("DELETE ERROR:", err);
}
};

// ================= EDIT =================
const handleEdit = (client)=>{
setFormData({
...client,
installments: client.installments || [],
amenities: client.amenities || ""
});

setEditId(client.id); // ✅ FIXED
setShowForm(true);
};

// ================= SEARCH =================
const filteredClients = clients.filter(c=>
c.name?.toLowerCase().includes(search.toLowerCase()) ||
c.project?.toLowerCase().includes(search.toLowerCase())
);

// ================= FLOORS =================
const floors = selectedProject
? Array.from({length:selectedProject.floors},(_,i)=>i+1)
: [];

// ================= BOOKED =================
const bookedRooms = clients
.filter(c =>
c.project === formData.project &&
String(c.floor) === String(formData.floor)
)
.map(c => c.room);

// ================= UI =================
return(

<div className="flex bg-gray-100 min-h-screen">

<Sidebar/>

<div className="flex-1 flex flex-col">

<Topbar/>

<div className="p-8">

<div className="flex justify-between mb-6">
<h1 className="text-3xl font-semibold">Client & Booking Details</h1>

<button onClick={()=>setShowForm(true)}
className="bg-orange-500 text-white px-6 py-3 rounded-xl">
+ Add Client
</button>
</div>

<input
type="text"
placeholder="Search by name or project..."
value={search}
onChange={(e)=>setSearch(e.target.value)}
className="border px-4 py-3 rounded-xl w-full mb-6"
/>

{showForm && (

<div className="bg-white p-8 rounded-2xl shadow mb-8">

<div className="grid grid-cols-2 gap-6">

<div><label>Name</label><input name="name" value={formData.name} onChange={handleChange} className="border px-4 py-3 rounded-xl w-full"/></div>

<div><label>Co Owner</label><input name="co_owner" value={formData.co_owner} onChange={handleChange} className="border px-4 py-3 rounded-xl w-full"/></div>

<div><label>Phone</label><input name="phone" value={formData.phone} onChange={handleChange} className="border px-4 py-3 rounded-xl w-full"/></div>

<div><label>Address</label><input name="address" value={formData.address} onChange={handleChange} className="border px-4 py-3 rounded-xl w-full"/></div>

<div><label>Project</label><select name="project" value={formData.project} onChange={handleChange} className="border px-4 py-3 rounded-xl w-full">
<option value="">-- Select Project --</option>
{projects.map((p)=>(<option key={p.id} value={p.name}>{p.name}</option>))}
</select></div>

<div><label>Floor</label><select name="floor" value={formData.floor} onChange={handleChange} className="border px-4 py-3 rounded-xl w-full">
<option value="">-- Select Floor --</option>
{floors.map(f=>(<option key={f} value={f}>Floor {f}</option>))}
</select></div>

<div><label>Room</label><select name="room" value={formData.room} onChange={handleChange} className="border px-4 py-3 rounded-xl w-full">
<option value="">-- Select Room --</option>
{generateRooms(formData.floor).map(room=>{
const isBooked = bookedRooms.includes(room);
return(<option key={room} value={room} disabled={isBooked}>{room}</option>);
})}
</select></div>

<div><label>Amount Paid</label><input type="number" name="amount_paid" value={formData.amount_paid} onChange={handleChange} className="border px-4 py-3 rounded-xl w-full"/></div>

<div><label>Payment Mode</label><select name="payment_mode" value={formData.payment_mode} onChange={handleChange} className="border px-4 py-3 rounded-xl w-full">
<option value="">Payment Mode</option>
<option>Cash</option>
<option>Bank</option>
<option>Cheque</option>
</select></div>

{/* ✅ AMENITIES */}
<div>
<label>Amenities</label>
<div className="flex gap-3 mt-2 flex-wrap">
{["Parking","Lift","Gym","Security","Garden"].map(item => (
<label key={item} className="flex items-center gap-1">
<input
type="checkbox"
checked={formData.amenities.includes(item)}
onChange={(e)=>handleAmenityChange(item,e.target.checked)}
/>
{item}
</label>
))}
</div>
</div>

</div>

{/* INSTALLMENTS */}
<div className="mt-6">
<h2 className="font-semibold mb-2">Installments</h2>

{formData.installments.map((inst,i)=>(
<div key={i} className="flex gap-3 mb-2">
<input type="number" value={inst.amount}
onChange={(e)=>handleInstallmentChange(i,"amount",e.target.value)}
className="border px-3 py-2"/>

<input type="date"
value={inst.date}
onChange={(e)=>handleInstallmentChange(i,"date",e.target.value)}
className="border px-3 py-2"/>
</div>
))}

<button onClick={addInstallment} className="bg-blue-500 text-white px-4 py-2 rounded">
+ Add Installment
</button>
</div>

<div className="mt-6 flex gap-4">
<button onClick={handleSubmit} className="bg-orange-500 text-white px-6 py-3 rounded-xl">Save</button>
<button onClick={()=>setShowForm(false)} className="bg-gray-300 px-6 py-3 rounded-xl">Cancel</button>
</div>

</div>
)}

{/* LIST */}
<div className="bg-white p-4 rounded-xl">
{filteredClients.map(c=>(
<div key={c.id} className="flex justify-between border-b py-2">
<div>
<p>{c.name}</p>
<p className="text-sm text-gray-500">{c.project}</p>
</div>

<div className="flex gap-2">
<button onClick={()=>handleEdit(c)}>Edit</button>
<button onClick={()=>handleDelete(c.id)}>Delete</button>
</div>
</div>
))}
</div>

</div>

</div>

</div>

);
}