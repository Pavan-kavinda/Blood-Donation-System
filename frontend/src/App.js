import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Droplet, 
  MapPin, 
  Phone, 
  User, 
  Send, 
  RefreshCcw, 
  AlertCircle, 
  CheckCircle2, 
  Database,
  Users,
  Activity,
  Heart
} from "lucide-react";
import "./App.css";

const API_BASE_URL = "http://localhost:5000";
const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

function toNumberOrEmpty(value) {
  if (value === "" || value === null || value === undefined) return "";
  const n = Number(value);
  return Number.isFinite(n) ? n : "";
}

export default function App() {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    name: "",
    bloodType: "",
    address: "",
    telephone: "",
    latitude: "",
    longitude: "",
  });

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
      locations: new Set(donors.map(d => d.address.split(',').pop().trim())).size
    };
  }, [donors]);

  const canSubmit = useMemo(() => {
    const lat = Number(form.latitude);
    const lng = Number(form.longitude);
    return (
      form.name.trim() &&
      form.bloodType &&
      form.address.trim() &&
      form.telephone.trim() &&
      Number.isFinite(lat) &&
      Number.isFinite(lng)
    );
  }, [form]);

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

  async function onSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    const latitude = Number(form.latitude);
    const longitude = Number(form.longitude);

    const payload = {
      name: form.name.trim(),
      bloodType: form.bloodType,
      address: form.address.trim(),
      telephone: form.telephone.trim(),
      location: {
        type: "Point",
        coordinates: [longitude, latitude],
      },
    };

    try {
      await axios.post(`${API_BASE_URL}/api/donors/register`, payload, {
        headers: { "Content-Type": "application/json" },
      });
      setSuccess("Donor registered successfully! Thank you for your contribution.");
      setForm({
        name: "",
        bloodType: "",
        address: "",
        telephone: "",
        latitude: "",
        longitude: "",
      });
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

  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="nav-brand">
          <Droplet className="icon-primary" size={32} fill="currentColor" />
          <span>LifeStream</span>
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
            <h2 className="card-title">Register as a Donor</h2>
            <p className="card-subtitle">Your information could save a life.</p>
          </div>
          
          <div className="form-container">
            <form onSubmit={onSubmit}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <div className="input-wrapper">
                  <User className="input-icon" size={18} />
                  <input 
                    className="form-input" 
                    placeholder="e.g. Kasun Perera"
                    value={form.name}
                    onChange={(e) => setForm({...form, name: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Blood Type</label>
                  <select 
                    className="form-input"
                    value={form.bloodType}
                    onChange={(e) => setForm({...form, bloodType: e.target.value})}
                  >
                    <option value="">Select Type</option>
                    {BLOOD_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Telephone</label>
                  <input 
                    className="form-input" 
                    placeholder="+94 7X XXX XXXX"
                    value={form.telephone}
                    onChange={(e) => setForm({...form, telephone: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Address</label>
                <textarea 
                  className="form-input" 
                  rows="3" 
                  placeholder="Street, City, District"
                  value={form.address}
                  onChange={(e) => setForm({...form, address: e.target.value})}
                ></textarea>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Latitude</label>
                  <input 
                    className="form-input" 
                    placeholder="6.9271"
                    value={form.latitude}
                    onChange={(e) => setForm({...form, latitude: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Longitude</label>
                  <input 
                    className="form-input" 
                    placeholder="79.8612"
                    value={form.longitude}
                    onChange={(e) => setForm({...form, longitude: e.target.value})}
                  />
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
                    Register Now
                  </>
                )}
              </button>
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
              {donors.length} Total
            </div>
          </div>

          <div className="table-container">
            {loading ? (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>Syncing with LifeStream Database...</p>
              </div>
            ) : donors.length === 0 ? (
              <div className="empty-state">
                <Database size={48} className="icon-dim" />
                <p>No donors registered yet.</p>
                <button className="btn-link" onClick={() => document.getElementById('register').scrollIntoView({behavior: 'smooth'})}>
                  Be the first donor
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
                    <th>Coordinates</th>
                  </tr>
                </thead>
                <tbody>
                  {donors.map((donor, idx) => (
                    <motion.tr 
                      key={donor._id || idx}
                      className="donor-row"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
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
                          {donor.location?.coordinates[1]?.toFixed(4)}, {donor.location?.coordinates[0]?.toFixed(4)}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
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
            LifeStream
          </div>
          <p>© 2026 LifeStream Management System. Built with Love for Humanity.</p>
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
