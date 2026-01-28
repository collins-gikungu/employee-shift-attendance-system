# Employee Shift & Attendance Management System

A full-stack web application designed to manage employee shifts, attendance tracking, and payroll processing efficiently.
Built using **Node.js**, **Express**, **PostgreSQL**, and **React**.

---
# 🔹 Project Overview
A role-based employee shift and attendance management system that allows staff to clock in/out securely while administrators manage employees, departments, and reports.

# 🔹 Tech Stack
* Backend: Node.js, Express.js
* Database: PostgreSQL
* Auth: JWT (role-based access)
* Frontend: React 
* Tools: VS Code, Thunder Client

## 📌 Features

### 🔐 Authentication & Authorization

* JWT-based authentication
* Admin and User roles
* Secure login & protected routes

### 👥 Employee Management

* Add, update, view, and manage employees
* Role-based access control
* Admin and Staff based dashboards

### 🕒 Shift Management

* Create and assign shifts
* Track shift schedules
* Overtime handling

### ✅ Attendance Tracking

* Clock-in / Clock-out functionality
* Daily attendance records
* Attendance reports

### 💰 Payroll Management

* Payroll calculation based on attendance & shifts
* Overtime integration
* Payroll reports

### 📊 Dashboard & Analytics

* Key metrics overview
* Attendance & payroll insights
* Admin/User dashboard split

---

## 🛠 Tech Stack

### Backend

* Node.js
* Express.js
* PostgreSQL
* JWT Authentication

### Frontend

* React.js
* Vite
* Context API
* CSS (Hospital-themed UI)

### Tools

* Git & GitHub
* Thunder Client (API testing)
* Visual Studio Code

---

## 📂 Project Structure

```
ShiftSystem/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   └── server.js
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── vite.config.js
│
└── README.md
```

---

## ⚙️ Setup Instructions

### Backend Setup

```bash
cd backend
npm install
npm start
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 🔐 Environment Variables

Create a `.env` file inside `backend/`:

```
PORT=5000
DATABASE_URL=postgresql
JWT_SECRET=your_secret_key
```

---

# 🔹 API Endpoints Table
| Method | Endpoint                  | Description       | Auth    |
| ------ | ------------------------- | ----------------- | ------- |
| POST   | /api/auth/login           | Login user        | ❌       |
| GET    | /api/employees            | Get all employees | ✅ Admin |
| POST   | /api/attendance/clock-in  | Clock in          | ✅       |
| POST   | /api/attendance/clock-out | Clock out         | ✅       |

---
### Attendance Rules
- Only one active clock-in session allowed per employee
- Clock-out closes the most recent open session
- Duplicate attendance entries are prevented at database level

---
## 📸 Screenshots

*(Coming soon)*

---

## 🚀 Future Enhancements

* Email notifications
* Role-based dashboards
* Export reports (PDF / Excel)
* Mobile responsiveness

---

## 👤 Author

**Collins Gikungu**

📧 Email: [gikungutech2002@gmail.com](mailto:gikungutech2002@gmail.com)
🌍 GitHub: [https://github.com/collins-gikungu](https://github.com/collins-gikungu)

---

## 📄 License

This project is licensed under the MIT License.
