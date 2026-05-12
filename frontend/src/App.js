import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
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
      setSuccess("Donor registered successfully.");
      setForm({
        name: "",
        bloodType: "",
        address: "",
        telephone: "",
        latitude: "",
        longitude: "",
      });
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
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <div className="brandMark" aria-hidden="true" />
          <div className="brandText">
            <div className="brandTitle">Blood Donation Management</div>
            <div className="brandSubtitle">Donor registration & directory</div>
          </div>
        </div>

        <div className="topbarActions">
          <button className="btn btnSecondary" type="button" onClick={fetchDonors} disabled={loading}>
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </header>

      <main className="grid">
        <section className="card">
          <div className="cardHeader">
            <h2 className="cardTitle">Register Donor</h2>
            <p className="cardHint">All fields are required. Location must be valid latitude/longitude.</p>
          </div>

          <form className="form" onSubmit={onSubmit}>
            <div className="field">
              <label className="label" htmlFor="name">
                Name
              </label>
              <input
                id="name"
                className="input"
                value={form.name}
                onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
                placeholder="e.g., Kasun Perera"
                autoComplete="name"
              />
            </div>

            <div className="field">
              <label className="label" htmlFor="bloodType">
                Blood Type
              </label>
              <select
                id="bloodType"
                className="input"
                value={form.bloodType}
                onChange={(e) => setForm((s) => ({ ...s, bloodType: e.target.value }))}
              >
                <option value="">Select a blood type</option>
                {BLOOD_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label className="label" htmlFor="telephone">
                Telephone
              </label>
              <input
                id="telephone"
                className="input"
                value={form.telephone}
                onChange={(e) => setForm((s) => ({ ...s, telephone: e.target.value }))}
                placeholder="e.g., +94 77 123 4567"
                autoComplete="tel"
              />
            </div>

            <div className="field">
              <label className="label" htmlFor="address">
                Address
              </label>
              <textarea
                id="address"
                className="input textarea"
                value={form.address}
                onChange={(e) => setForm((s) => ({ ...s, address: e.target.value }))}
                placeholder="Street, city, district"
                rows={3}
              />
            </div>

            <div className="row2">
              <div className="field">
                <label className="label" htmlFor="latitude">
                  Latitude
                </label>
                <input
                  id="latitude"
                  className="input"
                  inputMode="decimal"
                  value={form.latitude}
                  onChange={(e) => setForm((s) => ({ ...s, latitude: e.target.value }))}
                  placeholder="e.g., 6.9271"
                />
              </div>
              <div className="field">
                <label className="label" htmlFor="longitude">
                  Longitude
                </label>
                <input
                  id="longitude"
                  className="input"
                  inputMode="decimal"
                  value={form.longitude}
                  onChange={(e) => setForm((s) => ({ ...s, longitude: e.target.value }))}
                  placeholder="e.g., 79.8612"
                />
              </div>
            </div>

            {(error || success) && (
              <div className={`alert ${error ? "alertError" : "alertSuccess"}`} role="status">
                {error || success}
              </div>
            )}

            <button className="btn btnPrimary" type="submit" disabled={!canSubmit || submitting}>
              {submitting ? "Registering..." : "Register Donor"}
            </button>

            <div className="formFootnote">
              Backend: <span className="mono">{API_BASE_URL}</span>
            </div>
          </form>
        </section>

        <section className="card">
          <div className="cardHeader cardHeaderRow">
            <div>
              <h2 className="cardTitle">Donor List</h2>
              <p className="cardHint">Fetched from GET /api/donors/</p>
            </div>
            <div className="pill">{donors.length} donors</div>
          </div>

          <div className="tableWrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Blood Type</th>
                  <th>Telephone</th>
                  <th>Address</th>
                  <th>Latitude</th>
                  <th>Longitude</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="empty">
                      Loading donors...
                    </td>
                  </tr>
                ) : donors.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="empty">
                      No donors found. Register the first donor using the form.
                    </td>
                  </tr>
                ) : (
                  donors.map((d) => {
                    const lat = toNumberOrEmpty(d?.location?.coordinates?.[1]);
                    const lng = toNumberOrEmpty(d?.location?.coordinates?.[0]);
                    return (
                      <tr key={d?._id || `${d?.name}-${d?.bloodType}-${d?.address}`}>
                        <td className="cellStrong">{d?.name ?? "-"}</td>
                        <td>
                          <span className="tag">{d?.bloodType ?? "-"}</span>
                        </td>
                        <td>{d?.telephone ?? "-"}</td>
                        <td className="cellMuted">{d?.address ?? "-"}</td>
                        <td className="mono">{lat === "" ? "-" : lat}</td>
                        <td className="mono">{lng === "" ? "-" : lng}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

