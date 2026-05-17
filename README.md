# 🩸 Life to Life - Blood Donor Directory Application

A fully functional, highly secure, and real-time full-stack web application built using the **MERN (MongoDB, Express.js, React, Node.js) Stack** following the **MVC (Model-View-Controller)** architectural pattern. This platform bridges the gap between voluntary blood donors and seekers/medical administrators in Sri Lanka.

---

## 🚀 Key Features

* **Triple-Filtering Matrix:** Real-time client-side live search combining Donor Name (text match), Blood Group (dropdown), and District (dropdown) simultaneously.
* **Dual-Layer Security Validation:**
  * **User Self-Editing Authentication:** Users can modify their records by verifying identity via their registered National ID (NIC) number, which remains completely hidden from the public UI directory table for data privacy.
  * **Administrative Privilege Controls:** A secure "Admin Mode" switch protected by a token password (`admin123`) that unlocks backend `DELETE` operations and direct `PUT` edits.
* **Global State Reset:** A centralized "Home View" button to clear all active filters instantly.
* **Responsive Crimson UI:** Clean, modern, minimalist theme suited for healthcare and blood service dashboards.

---

## 🛠️ Technology Stack

* **Frontend:** React (Single Page Application), Axios, CSS3 (Custom Crimson Theme)
* **Backend:** Node.js, Express.js Web Framework
* **Database:** MongoDB Atlas (Cloud-hosted NoSQL Architecture) via Mongoose ODM
* **Architecture:** Model-View-Controller (MVC) Pattern

---

## 💻 Installation & Setup Guide

Prerequisites: Ensure you have Node.js installed on your machine.

### 1. Configure the Backend
Navigate to the server/backend directory:
cd backend

Install the backend dependencies:
npm install

Start the backend server:
node server.js

### 2. Configure the Frontend
Open a new terminal tab/window and navigate to the client/frontend directory:
cd frontend

Install the frontend dependencies:
npm install

Start the React development application:
npm start

---

## 🔓 Access Credentials for Presentation Testing

* **Admin Mode Password:** admin123
* **Sample NIC for Self-Editing Test:** 200009200458
