import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Droplet, 
  MapPin, 
  Phone, 
  User, 
  RefreshCcw, 
  AlertCircle, 
  CheckCircle2, 
  Database,
  Users,
  Activity,
  Heart,
  Shield,
  Trash2,
  Edit2,
  X,
  Fingerprint
} from "lucide-react";
import "./App.css";

const API_BASE_URL = "http://localhost:5000";
const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const DISTRICTS = [
  "Ampara", "Anuradhapura", "Badulla", "Batticaloa", "Colombo", 
  "Galle", "Gampaha", "Hambantota", "Jaffna", "Kalutara", 
  "Kandy", "Kegalle", "Kilinochchi", "Kurunegala", "Mannar", 
  "Matale", "Matara", "Moneragala", "Mullaitivu", "Nuwara Eliya", 
  "Polonnaruwa", "Puttalam", "Ratnapura", "Trincomalee", "Vavuniya"
];



export default function App() {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [adminMode, setAdminMode] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editDonorId, setEditDonorId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    bloodType: "",
    address: "",
    telephone: "",
    district: "",
    idNumber: "",
  });

  const [filterDistrict, setFilterDistrict] = useState("");
  const [filterBloodType, setFilterBloodType] = useState("All");
  const [filterName, setFilterName] = useState("");
  const [touched, setTouched] = useState({});

  const stats = useMemo(() => {
    const totalDonors = donors.length;
    const typesCount = BLOOD_TYPES.reduce((acc, type) => {
      acc[type] = donors.filter(d => d.bloodType === type).length;
      return acc;
    }, {});
    
    // Find rarest type among donors
    const counts = Object.values(typesCount).filter(c => c > 0);
    const rarestCount = counts.length > 0 ? Math.min(...counts) : 0;
    const rarestType = Object.keys(typesCount).find(type => typesCount[type] === rarestCount && rarestCount > 0) || "N/A";

    return {
      total: totalDonors,
      rarest: rarestType,
      recent: donors.slice(0, 5).length,
      locations: new Set(donors.map(d => d.district || "Unknown")).size
    };
  }, [donors]);

  const filteredDonors = useMemo(() => {
    return donors.filter(donor => {
      const matchesName = donor.name.toLowerCase().includes(filterName.toLowerCase());
      const matchesDistrict = !filterDistrict || donor.district === filterDistrict;
      const matchesType = filterBloodType === "All" || donor.bloodType === filterBloodType;
      return matchesName && matchesDistrict && matchesType;
    });
  }, [donors, filterName, filterDistrict, filterBloodType]);

  const canSubmit = useMemo(() => {
    return (
      form.name.trim() &&
      form.bloodType &&
      form.address.trim() &&
      form.telephone.trim() &&
      form.district &&
      form.idNumber.trim()
    );
  }, [form]);

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const isFieldInvalid = (field) => {
    if (!touched[field]) return false;
    return !form[field]?.trim();
  };

  async function fetchDonors() {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`${API_BASE_URL}/api/donors/`);
      setDonors(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      setError(
        e?.response?.data?.error ||
          e?.message ||
          "Failed to fetch donors. Please check the backend is running."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDonors();
  }, []);



  async function handleEditClick(donor) {
    // If adminMode is active, bypass identity verification
    if (adminMode) {
      setIsEditing(true);
      setEditDonorId(donor._id);
      setForm({
        name: donor.name,
        bloodType: donor.bloodType,
        address: donor.address,
        telephone: donor.telephone,
        district: donor.district,
        idNumber: donor.idNumber
      });
      setTouched({});
      alert("Admin Access: Edit mode activated.");
      document.getElementById('register').scrollIntoView({ behavior: 'smooth' });
      return;
    }

    // Normal user verification
    const idCheck = prompt("Enter your Registered National ID (NIC) Number to verify identity:");
    if (!idCheck) return; // user cancelled/empty

    const savedID = String(donor.idNumber || "").trim();
    const enteredID = String(idCheck).trim();
    
    if (enteredID === savedID && savedID !== "") {
      setIsEditing(true);
      setEditDonorId(donor._id);
      setForm({
        name: donor.name,
        bloodType: donor.bloodType,
        address: donor.address,
        telephone: donor.telephone,
        district: donor.district,
        idNumber: donor.idNumber
      });
      setTouched({});
      alert("Access Granted. You can now update your details.");
      document.getElementById('register').scrollIntoView({ behavior: 'smooth' });
    } else {
      alert("Access Denied! Incorrect ID Number. You can only edit your own record.");
    }
  }

  function cancelEdit() {
    setIsEditing(false);
    setEditDonorId(null);
    setForm({
      name: "",
      bloodType: "",
      address: "",
      telephone: "",
      district: "",
      idNumber: "",
    });
    setTouched({});
  }

  async function onSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    const payload = {
      name: form.name.trim(),
      bloodType: form.bloodType,
      address: form.address.trim(),
      telephone: form.telephone.trim(),
      district: form.district,
      idNumber: form.idNumber.trim()
    };

    try {
      if (isEditing) {
        await axios.put(`${API_BASE_URL}/api/donors/${editDonorId}`, payload, {
          headers: { "Content-Type": "application/json" },
        });
        setSuccess("Donor details updated successfully!");
      } else {
        await axios.post(`${API_BASE_URL}/api/donors/register`, payload, {
          headers: { "Content-Type": "application/json" },
        });
        setSuccess("Donor registered successfully! Thank you for your contribution.");
      }

      setForm({
        name: "",
        bloodType: "",
        address: "",
        telephone: "",
        district: "",
        idNumber: "",
      });
      setIsEditing(false);
      setEditDonorId(null);
      setTouched({});
      setTimeout(() => setSuccess(""), 5000);
      await fetchDonors();
    } catch (e) {
      setError(
        e?.response?.data?.error ||
          e?.response?.data?.message ||
          e?.message ||
          "Failed to register donor."
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeleteDonor(id) {
    if (!window.confirm("Are you sure you want to remove this donor? This action cannot be undone.")) return;
    
    try {
      await axios.delete(`${API_BASE_URL}/api/donors/${id}`);
      setDonors(prev => prev.filter(d => d._id !== id));
      setSuccess("Donor removed successfully.");
      setTimeout(() => setSuccess(""), 3000);
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to delete donor.");
      setTimeout(() => setError(""), 3000);
    }
  }

  async function handleToggleAdmin() {
    if (!adminMode) {
      const password = prompt("Enter Admin Password:");
      if (password === "admin123") {
        setAdminMode(true);
        setSuccess("Access Granted. Admin Mode Activated.");
        setTimeout(() => setSuccess(""), 3000);
      } else if (password !== null) {
        setError("Access Denied. Incorrect Password.");
        setTimeout(() => setError(""), 3000);
      }
    } else {
      setAdminMode(false);
    }
  }

  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="nav-brand">
          <Droplet className="icon-primary" size={32} fill="currentColor" />
          <span>Life to Life</span>
        </div>
        <div className="nav-links">
          <a href="#donors" className="nav-link active">Directory</a>
          <a href="#register" className="nav-link">Register</a>
          <button className="nav-link" onClick={fetchDonors}>
            <RefreshCcw size={18} className={loading ? "spin" : ""} />
          </button>
        </div>
      </nav>

      <header className="hero">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="hero-badge">Emergency Blood Connect</span>
          <h1 className="hero-title">Every Drop Matters. <br/>Save a Life Today.</h1>
          <p className="hero-subtitle">
            A seamless platform connecting blood donors with those in need. 
            Real-time tracking, easy registration, and instant directory access.
          </p>
        </motion.div>
      </header>

      <section className="stats-grid">
        <StatCard icon={<Users size={24} />} label="Total Donors" value={stats.total} delay={0.1} />
        <StatCard icon={<Droplet size={24} />} label="Rarest Type" value={stats.rarest} delay={0.2} />
        <StatCard icon={<MapPin size={24} />} label="Regions Covered" value={stats.locations} delay={0.3} />
        <StatCard icon={<Activity size={24} />} label="Recent Registrations" value={stats.recent} delay={0.4} />
      </section>

      <main className="content-grid">
        <aside className="glass-card" id="register">
          <div className="card-header">
            <h2 className="card-title">{isEditing ? "Update Donor Details" : "Register as a Donor"}</h2>
            <p className="card-subtitle">{isEditing ? "Modifying existing donor information." : "Your information could save a life."}</p>
          </div>
          
          <div className="form-container">
            <form onSubmit={onSubmit}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <div className="input-wrapper">
                  <User className="input-icon" size={18} />
                  <input 
                    className={`form-input ${isFieldInvalid('name') ? 'border-error' : ''}`} 
                    placeholder="e.g. Kasun Perera"
                    value={form.name}
                    onChange={(e) => setForm({...form, name: e.target.value})}
                    onBlur={() => handleBlur('name')}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Blood Type</label>
                  <select 
                    className={`form-input ${isFieldInvalid('bloodType') ? 'border-error' : ''}`}
                    value={form.bloodType}
                    onChange={(e) => setForm({...form, bloodType: e.target.value})}
                    onBlur={() => handleBlur('bloodType')}
                  >
                    <option value="">Select Type</option>
                    {BLOOD_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Telephone</label>
                  <input 
                    className={`form-input ${isFieldInvalid('telephone') ? 'border-error' : ''}`} 
                    placeholder="+94 7X XXX XXXX"
                    value={form.telephone}
                    onChange={(e) => setForm({...form, telephone: e.target.value})}
                    onBlur={() => handleBlur('telephone')}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Address</label>
                <textarea 
                  className={`form-input ${isFieldInvalid('address') ? 'border-error' : ''}`} 
                  rows="3" 
                  placeholder="Street, City, District"
                  value={form.address}
                  onChange={(e) => setForm({...form, address: e.target.value})}
                  onBlur={() => handleBlur('address')}
                ></textarea>
              </div>

              <div className="form-group">
                <label className="form-label">National ID (NIC) Number</label>
                <div className="input-wrapper">
                  <Fingerprint className="input-icon" size={18} />
                  <input 
                    className={`form-input ${isFieldInvalid('idNumber') ? 'border-error' : ''}`} 
                    placeholder="e.g. 19XXXXXXXXXX or XXXXXXXXXV"
                    value={form.idNumber}
                    onChange={(e) => setForm({...form, idNumber: e.target.value})}
                    onBlur={() => handleBlur('idNumber')}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">District</label>
                <div className="input-wrapper">
                  <MapPin className="input-icon" size={18} />
                  <select 
                    className={`form-input ${isFieldInvalid('district') ? 'border-error' : ''}`}
                    value={form.district}
                    onChange={(e) => setForm({...form, district: e.target.value})}
                    onBlur={() => handleBlur('district')}
                  >
                    <option value="">Select District</option>
                    {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="alert alert-error"
                  >
                    <AlertCircle size={18} />
                    {error}
                  </motion.div>
                )}
                {success && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="alert alert-success"
                  >
                    <CheckCircle2 size={18} />
                    {success}
                  </motion.div>
                )}
              </AnimatePresence>

              <button 
                type="submit" 
                className="btn-submit"
                disabled={!canSubmit || submitting}
              >
                {submitting ? (
                  <RefreshCcw className="spin" size={20} />
                ) : (
                  <>
                    <Heart size={20} fill="currentColor" />
                    {isEditing ? "Update Details" : "Register Now"}
                  </>
                )}
              </button>
              
              {isEditing && (
                <button 
                  type="button" 
                  className="btn-cancel"
                  onClick={cancelEdit}
                  disabled={submitting}
                >
                  <X size={20} />
                  Cancel
                </button>
              )}
            </form>
          </div>
        </aside>

        <section className="glass-card" id="donors">
          <div className="card-header flex-header">
            <div>
              <h2 className="card-title">Donor Directory</h2>
              <p className="card-subtitle">Active donors in your network</p>
            </div>
            <div className="badge-outline">
              <Database size={14} />
              {filteredDonors.length} {filteredDonors.length === donors.length ? "Total" : "Found"}
            </div>
          </div>

          <div className="search-container">
            <div className="search-input-group">
              <User className="search-icon" size={18} />
              <input 
                type="text"
                className="filter-select"
                style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none' }}
                placeholder="Search Donor Name"
                value={filterName}
                onChange={(e) => setFilterName(e.target.value)}
              />
            </div>
            <div className="search-input-group">
              <MapPin className="search-icon" size={18} />
              <select 
                className="filter-select" 
                style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none' }}
                value={filterDistrict}
                onChange={(e) => setFilterDistrict(e.target.value)}
              >
                <option value="">Filter District</option>
                {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <select 
              className="filter-select"
              value={filterBloodType}
              onChange={(e) => setFilterBloodType(e.target.value)}
            >
              <option value="All">Filter Blood Group</option>
              {BLOOD_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            
            <div 
              className={`admin-toggle ${adminMode ? 'active' : ''}`}
              onClick={handleToggleAdmin}
            >
              <Shield size={16} color={adminMode ? "var(--primary)" : "var(--text-dim)"} />
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: adminMode ? 'var(--primary)' : 'var(--text-muted)' }}>
                Admin Mode
              </span>
              <div className="toggle-switch"></div>
            </div>
          </div>

          <div className="table-container">
            {loading ? (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>Syncing with Life to Life Database...</p>
              </div>
            ) : donors.length === 0 ? (
              <div className="empty-state">
                <Database size={48} className="icon-dim" />
                <p>No donors registered yet.</p>
                <button className="btn-link" onClick={() => document.getElementById('register').scrollIntoView({behavior: 'smooth'})}>
                  Be the first donor
                </button>
              </div>
            ) : filteredDonors.length === 0 ? (
              <div className="empty-state">
                <MapPin size={48} className="icon-dim" />
                <p>No donors found matching your search criteria.</p>
                <button className="btn-link" onClick={() => { setFilterName(""); setFilterDistrict(""); setFilterBloodType("All"); }}>
                  Clear all filters
                </button>
              </div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Donor Name</th>
                    <th>Type</th>
                    <th>Contact</th>
                    <th>Location</th>
                    <th>District</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence mode="popLayout">
                    {filteredDonors.map((donor, idx) => (
                      <motion.tr 
                        key={donor._id || idx}
                        className="donor-row"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        layout
                      >
                        <td>
                          <div className="donor-name">
                            <div className="avatar-mini">{donor.name?.charAt(0)}</div>
                            {donor.name}
                          </div>
                        </td>
                        <td>
                          <span className="blood-tag">{donor.bloodType}</span>
                        </td>
                        <td>
                          <a href={`tel:${donor.telephone}`} className="phone-link">
                            <Phone size={14} />
                            {donor.telephone}
                          </a>
                        </td>
                        <td className="text-muted">{donor.address}</td>
                        <td>
                          <div className="coord-tag">
                            {donor.district || "N/A"}
                          </div>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button 
                              className="btn-edit"
                              onClick={() => handleEditClick(donor)}
                            >
                              <Edit2 size={14} />
                              Edit
                            </button>
                            {adminMode && (
                              <button 
                                className="btn-delete"
                                onClick={() => handleDeleteDonor(donor._id)}
                              >
                                <Trash2 size={14} />
                                Delete
                              </button>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            )}
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <Droplet size={20} fill="currentColor" />
            Life to Life
          </div>
          <p>© 2026 Life to Life Management System. Built with Love for Humanity.</p>
        </div>
      </footer>
    </div>
  );
}

function StatCard({ icon, label, value, delay }) {
  return (
    <motion.div 
      className="stat-card"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.4 }}
    >
      <div className="stat-icon">{icon}</div>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </motion.div>
  );
}
