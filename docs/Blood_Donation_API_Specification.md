# API Specification: Blood Donation Management System

**Version:** 1.0  
**Base URL:** `http://localhost:5000/api`  
**Format:** JSON  

---

## 1. Overview
This API allows the Blood Donation Management System to manage donor records. It follows RESTful principles, providing endpoints to create and retrieve donor information with geographical support.

---

## 2. Endpoints

### 2.1 Get All Donors
Retrieves a list of all registered donors in the database.

* **URL:** `/donors`
* **Method:** `GET`
* **Auth Required:** No
* **Success Response:**
    * **Code:** 200 OK
    * **Content:**
        ```json
        [
          {
            "_id": "6a00940e4c0cf94832e1d3e1",
            "name": "Pavan Kavinda",
            "bloodType": "A+",
            "address": "Galgamuwa, Kurunegala",
            "telephone": "076-0560015",
            "location": {
              "type": "Point",
              "coordinates": [7.56, 79.86]
            },
            "__v": 0
          }
        ]
        ```

### 2.2 Register a New Donor
Creates a new donor record in the database.

* **URL:** `/donors`
* **Method:** `POST`
* **Auth Required:** No
* **Request Body:**
    ```json
    {
      "name": "Full Name",
      "bloodType": "A+/B+/O+/etc",
      "address": "Street, City",
      "telephone": "07X-XXXXXXX",
      "latitude": 7.56,
      "longitude": 79.86
    }
    ```
* **Success Response:**
    * **Code:** 201 Created
    * **Content:** `{ "message": "Donor registered successfully" }`
* **Error Response:**
    * **Code:** 400 Bad Request
    * **Content:** `{ "error": "All fields are required" }`

---

## 3. Data Models

### 3.1 Donor Object
| Field | Type | Description |
| :--- | :--- | :--- |
| `name` | String | Full name of the donor (Required) |
| `bloodType` | String | Blood group (Required) |
| `address` | String | Physical address (Required) |
| `telephone` | String | Contact number (Required) |
| `location` | Object | GeoJSON Point (type, coordinates [long, lat]) |

---

## 4. Error Handling
The API uses standard HTTP status codes:
* `200`: Success.
* `201`: Resource created successfully.
* `400`: Validation error or missing fields.
* `500`: Internal server error.

---

## 5. Security & CORS
The API implements **CORS** (Cross-Origin Resource Sharing) to allow requests from the React frontend (`localhost:3000`).
