import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function Projectdetails() {
  const [showForm, setShowForm] = useState(false);
  const [projects, setProjects] = useState([]);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    location: "",
    minBudget: "",
    maxBudget: "",
    floors: "",
    area: "",
    parking: "",
    amenities: "",
    start_date: "",
    end_date: "",
    duration: "",
    description: "",
    status: "Active"
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/projects");
      setProjects(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
  const { name, value } = e.target;

  // Allow only letters
  if (name === "name" && !/^[A-Za-z ]*$/.test(value)) return;
  if (name === "location" && !/^[A-Za-z ]*$/.test(value)) return;

  // Floors limit
  if (name === "floors") {
    if (value < 0) return;
    if (value > 30) return;
  }

  // Area
  if (name === "area" && value < 0) return;

  // ✅ FIXED: Budget (ALLOW typing, only block negative)
  if (name === "minBudget" || name === "maxBudget") {
    if (value < 0) return;
  }

  let updated = {
    ...formData,
    [name]: value,
  };

  // Duration calculation
  if (name === "start_date" || name === "end_date") {
    const start = name === "start_date" ? value : formData.start_date;
    const end = name === "end_date" ? value : formData.end_date;

    if (start && end) {
      const years =
        (new Date(end) - new Date(start)) /
        (1000 * 60 * 60 * 24 * 365);

      updated.duration = years > 0 ? years.toFixed(2) : 0;
    }
  }

  setFormData(updated);
};

  const handleAmenityChange = (amenity, checked) => {
    let currentAmenities = formData.amenities
      ? formData.amenities.split(",")
      : [];

    if (checked) {
      currentAmenities.push(amenity);
    } else {
      currentAmenities = currentAmenities.filter(
        (item) => item !== amenity
      );
    }

    setFormData({
      ...formData,
      amenities: currentAmenities.join(","),
    });
  };

  const validateForm = () => {
    if (!formData.name) {
      alert("Project name required");
      return false;
    }

    if (!formData.location) {
      alert("Location required");
      return false;
    }

    if (!formData.minBudget || !formData.maxBudget) {
      alert("Budget required");
      return false;
    }

    if (
      Number(formData.minBudget) < 10000000 ||
      Number(formData.minBudget) > 200000000
    ) {
      alert("Minimum budget must be between 1 Cr and 20 Cr");
      return false;
    }

    if (
      Number(formData.maxBudget) < 10000000 ||
      Number(formData.maxBudget) > 200000000
    ) {
      alert("Maximum budget must be between 1 Cr and 20 Cr");
      return false;
    }

    if (Number(formData.maxBudget) < Number(formData.minBudget)) {
      alert("Max budget must be greater than Min budget");
      return false;
    }

    if (!formData.floors) {
      alert("Floors required");
      return false;
    }

    if (Number(formData.floors) > 30) {
      alert("Maximum 30 floors allowed");
      return false;
    }

    if (!formData.area) {
      alert("Area required");
      return false;
    }

    if (!formData.start_date || !formData.end_date) {
      alert("Start date and end date required");
      return false;
    }

    const startDate = new Date(formData.start_date);
    const endDate = new Date(formData.end_date);

    if (startDate >= endDate) {
      alert("End date must be after start date");
      return false;
    }

    const oneYearLater = new Date(startDate);
    oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);

    if (endDate < oneYearLater) {
      alert("End date must be at least 1 year after start date");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      if (editId) {
        await axios.put(
          `http://localhost:5000/api/projects/${editId}`,
          formData
        );
      } else {
        await axios.post(
  "http://localhost:5000/api/projects",
  formData
);
      }

      fetchProjects();

      setFormData({
        name: "",
        location: "",
        minBudget: "",
        maxBudget: "",
        floors: "",
        area: "",
        parking: "",
        amenities: "",
        start_date: "",
        end_date: "",
        duration: "",
        description: "",
        status: "Active"
      });

      setEditId(null);
      setShowForm(false);
    } catch (err) {
      console.log(err);
      alert("Error saving project");
    }
  };

  const handleEdit = (project) => {
    setFormData({
      name: project.name || "",
      location: project.location || "",
      minBudget: project.minBudget || "",
      maxBudget: project.maxBudget || "",
      floors: project.floors || "",
      area: project.area || "",
      parking: project.parking || "",
      amenities: project.amenities || "",
      start_date: project.start_date || "",
      end_date: project.end_date || "",
      duration: project.duration || "",
      description: project.description || "",
      status: project.status || "Active"
    });

    setEditId(project.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this project?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/projects/${id}`);
      fetchProjects();
    } catch (err) {
      console.log(err);
      alert("Error deleting project");
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Topbar />

        <div className="p-8">
          {!showForm ? (
            <>
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Projects</h1>

                <button
                  onClick={() => setShowForm(true)}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded"
                >
                  + Add Project
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((p) => (
                  <div key={p.id} className="bg-white rounded-lg shadow p-5">
                    <div className="flex justify-end gap-3 mb-3 text-lg">
                      <button onClick={() => handleEdit(p)}>✏️</button>
                      <button onClick={() => handleDelete(p.id)}>🗑️</button>
                    </div>

                    <h2 className="text-lg font-bold">{p.name}</h2>
                    <p>{p.location}</p>
                    <p>Min Budget: ₹{p.minBudget}</p>
                    <p>Max Budget: ₹{p.maxBudget}</p>
                    <p>Floors: {p.floors}</p>
                    <p>Area: {p.area} sq.ft</p>
                    <p>Parking: {p.parking}</p>
                    <p>Amenities: {p.amenities}</p>
                    <p>Status: {p.status}</p>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-2xl font-bold mb-6">Project Form</h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="border p-2 w-full rounded"
                  />
                </div>

                <div>
                  <label className="block mb-1">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="border p-2 w-full rounded"
                  />
                </div>

                <div>
                  <label className="block mb-1">Min Budget</label>
                  <input
                    type="number"
                    name="minBudget"
                    value={formData.minBudget}
                    onChange={handleChange}
                    min="10000000"
                    max="200000000"
                    className="border p-2 w-full rounded"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Minimum 1 Cr - Maximum 20 Cr
                  </p>
                </div>

                <div>
                  <label className="block mb-1">Max Budget</label>
                  <input
                    type="number"
                    name="maxBudget"
                    value={formData.maxBudget}
                    onChange={handleChange}
                    min="10000000"
                    max="200000000"
                    className="border p-2 w-full rounded"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Minimum 1 Cr - Maximum 20 Cr
                  </p>
                </div>

                <div>
                  <label className="block mb-1">Floors</label>
                  <input
                    type="number"
                    name="floors"
                    value={formData.floors}
                    onChange={handleChange}
                    min="1"
                    max="30"
                    className="border p-2 w-full rounded"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Maximum 30 floors allowed
                  </p>
                </div>

                <div>
                  <label className="block mb-1">Area (sq.ft)</label>
                  <input
                    type="number"
                    name="area"
                    value={formData.area}
                    onChange={handleChange}
                    className="border p-2 w-full rounded"
                  />
                </div>

                <div>
                  <label className="block mb-1">Parking</label>
                  <select
                    name="parking"
                    value={formData.parking}
                    onChange={handleChange}
                    className="border p-2 w-full rounded"
                  >
                    <option value="">Select</option>
                    <option value="No Parking">No Parking</option>
                    <option value="Bike Only">Bike Only</option>
                    <option value="Car Limited">Car Limited</option>
                    <option value="Full Parking">Full Parking</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1">Amenities</label>
                  <div className="flex flex-wrap gap-3 mt-2">
                    {["Lift", "Gym", "Security", "CCTV", "Garden", "Pool"].map((item) => (
                      <label key={item} className="flex items-center gap-1">
                        <input
                          type="checkbox"
                          checked={formData.amenities.includes(item)}
                          onChange={(e) =>
                            handleAmenityChange(item, e.target.checked)
                          }
                        />
                        {item}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block mb-1">Start Date</label>
                  <input
                    type="date"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleChange}
                    min={today}
                    className="border p-2 w-full rounded"
                  />
                </div>

                <div>
                  <label className="block mb-1">End Date</label>
                  <input
                    type="date"
                    name="end_date"
                    value={formData.end_date}
                    onChange={handleChange}
                    className="border p-2 w-full rounded"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    End date must be at least 1 year after start date
                  </p>
                </div>
              </div>

              <p className="mt-4 font-medium">
                Duration: {formData.duration || 0} years
              </p>

              <div className="mt-4">
                <label className="block mb-1">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="border p-2 w-full rounded"
                >
                  <option value="Active">Active</option>
                  <option value="Completed">Completed</option>
                  <option value="On Hold">On Hold</option>
                </select>
              </div>

              <div className="mt-4">
                <label className="block mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className="border p-2 w-full rounded"
                />
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={handleSubmit}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded"
                >
                  Save
                </button>

                <button
                  onClick={() => {
                    setShowForm(false);
                    setEditId(null);
                  }}
                  className="bg-gray-300 hover:bg-gray-400 px-6 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}