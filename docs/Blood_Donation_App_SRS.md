# Software Requirements Specification (SRS)
## Project: Blood Donation Management System (BDMS)

**Version:** 1.0  
**Date:** May 11, 2026  
**Author:** Pavan Kavinda  
**Status:** Final Draft

---

## 1. Introduction

### 1.1 Purpose
The purpose of this document is to provide a detailed overview of the Software Requirements Specification for the Blood Donation Management System. This system is designed to streamline the process of donor registration and facilitate the discovery of blood donors based on geographical location and blood type.

### 1.2 Scope
The BDMS is a full-stack web application (MERN) that allows users to register as blood donors by providing personal details and geographical coordinates. It maintains a centralized database of donors accessible via a professional dashboard.

### 1.3 Definitions, Acronyms, and Abbreviations
* **MERN:** MongoDB, Express, React, Node.js.
* **GeoJSON:** A format for encoding a variety of geographic data structures.
* **UI/UX:** User Interface and User Experience.
* **SRS:** Software Requirements Specification.

---

## 2. Overall Description

### 2.1 Product Perspective
The application serves as a bridge between blood seekers and donors. It operates as a standalone web portal consisting of a React-based frontend, a Node/Express backend API, and a MongoDB database for persistent storage.

### 2.2 Product Functions
* **Donor Registration:** Captures name, blood type, telephone number, address, and location (Latitude/Longitude).
* **Donor Directory:** Displays a real-time table of all registered donors.
* **Location Integration:** Stores donor locations using GeoJSON for future mapping capabilities.
* **Data Validation:** Ensures all required fields are populated before submission.

### 2.3 User Classes and Characteristics
* **General Users/Donors:** Individuals who wish to volunteer and register their information.
* **Administrators/Healthcare Workers:** Users who view the donor list to coordinate blood drives or emergency donations.

### 2.4 Operating Environment
* **Frontend:** Modern web browsers (Chrome, Firefox, Edge).
* **Backend:** Node.js Runtime Environment (v18+).
* **Database:** MongoDB Community Server or Atlas.

---

## 3. System Features

### 3.1 Donor Registration Module
* **Description:** A form-based interface to input donor data.
* **Inputs:** Name (Text), Blood Type (Dropdown), Telephone (String), Address (Text), Latitude/Longitude (Numerical).
* **Outputs:** Success/Error notification and immediate update to the donor list.

### 3.2 Live Donor List
* **Description:** A dynamic table that fetches data from the backend.
* **Features:** Displays Donor Name, Blood Group, Telephone, and Location.

---

## 4. External Interface Requirements

### 4.1 User Interfaces
* A responsive dashboard designed with a dark/modern theme.
* Input fields with placeholders and clear labels.

### 4.2 Software Interfaces
* **Backend API:** RESTful endpoints (e.g., `GET /api/donors`, `POST /api/donors`).
* **Database Interface:** Mongoose ODM for MongoDB communication.

---

## 5. Non-Functional Requirements

### 5.1 Performance
* The system should load the donor directory in under 2 seconds for a standard database size.

### 5.2 Scalability
* The system architecture allows for horizontal scaling of the backend and the addition of search/filter modules without structural changes.

### 5.3 Reliability
* The database ensures data persistence even if the backend server restarts.

### 5.4 Security
* Implementation of CORS (Cross-Origin Resource Sharing) to restrict unauthorized frontend-backend communication.

---

## 6. System Architecture

The project follows the **MVC (Model-View-Controller)** pattern:
* **Model:** Mongoose schemas (`Donor.js`).
* **View:** React Components.
* **Controller:** Express route handlers and logic in `server.js`.
