* Smart Attendance Management System

A full-stack attendance system with separate dashboards for Employees and Managers, built using React + Node.js + MongoDB.
Supports role-based login, dummy frontend dashboards, and is ready for backend API integration.

🚀 Features
👤 Employee Panel

Login & Role-based access

Check-In / Check-Out (dummy data)

Monthly Summary

Attendance History Table

🧠 Manager Panel

Dashboard for all employees

Filter records by Employee ID / Date / Status

Daily summary: Present / Late / Absent

Team statistics table (dummy data)

🛠️ Tech Stack
Area	Technology Used
Frontend	React + Vite
Backend	Node.js + Express.js
Database	MongoDB Atlas
Auth	JWT + Bcrypt
UI / Icons	Lucide React Icons
State	Zustand (for auth)
📂 Project Structure
attendance-project/
│
├── backend/           → API, DB Models, Auth, .env setup
│   └── src/
│       ├── routes/
│       ├── models/
│       ├── middleware/
│       └── server.js
│
├── frontend/          → React + Vite (UI only for now)
│   └── src/
│       ├── App.jsx
│       ├── pages/
│       └── components/
│
└── README.md

⚙️ Setup Instructions
🔹 1. Clone the Repository
git clone https://github.com/your-username/attendance-project.git
cd attendance-project

🔹 2. Install Dependencies
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install

🔐 Environment Variables (Backend)

Create a file named .env inside backend/ :

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key


⚠️ Do NOT commit .env file to GitHub.

▶️ Run the Project
Start Backend (Node + Express)
cd backend
npm run dev

Start Frontend (React + Vite)
cd frontend
npm run dev


👉 Now open browser:
http://localhost:5173

🔑 Demo Login Credentials (Frontend Dummy Auth)
Role	Email	Password
Employee	emp1@example.com
	Emp12345
Manager	manager1@example.com
	Manager123
🖼 Screenshots
🔐 Login Page

![alt text](<Screenshot 2025-11-30 134002-1.png>)


 Employee Dashboard

![alt text](<Screenshot 2025-11-30 133939.png>)

 Manager Dashboard
![alt text](<Screenshot 2025-11-30 134029.png>)

** Planned Improvements (Internship Scope)**

Live API Integration with MongoDB

Leave Request Module

Admin Role & Analytics

CSV / Excel Export

Email / Notification system

Performance Tracking System

**** Author***

Name:Sakshi Vaibhav Mane
Course:Computer Science & Business Systems (7th Sem)
College name: SG Balekundri Institute of Technology Belagavi
Contact:9380056384
Email:sakshivaibhavmane24@gmail.com 
 Karnataka, India
Aspiring Software Developer (SDE)
