# 🐛 BugTracker — Bug Management System

A full-stack bug tracking system built with **ReactJS** and **PHP (OOP)** with MySQL database.

## 👥 Modules
- **Admin** — Manage staff, projects, bugs, assignments and messages
- **Staff** — View assigned bugs, update status, message customers
- **Customer** — Report bugs, track status using ticket number

## 🛠️ Tech Stack
| Layer | Technology |
|-------|-----------|
| Frontend | ReactJS, Bootstrap, Tabler Icons |
| Backend | PHP (OOP), MySQL |
| Server | XAMPP (Apache + MySQL) |

## 🚀 How to Run

### 1. Clone the project
```bash
git clone https://github.com/hamzadaykeh/bugtracker.git
cd bugtracker
```

### 2. Setup Database
- Open XAMPP → Start **Apache** and **MySQL**
- Go to `http://localhost/phpmyadmin`
- Create database named `bugtracker_db`
- Run the SQL from `backend/database.sql`

### 3. Setup Backend
- Copy the `backend` folder to:
C:\xampp\htdocs\bugtracker\backend
### 4. Setup Frontend
```bash
cd frontend
npm install
npm start
```

### 5. Open the app
http://localhost:3000
## 🔑 Default Login
| Role | Username | Password |
|------|----------|----------|
| Admin | `admin` | `password` |
| Staff | Create via Admin panel | — |
| Customer | Register at `/register` | — |

## 📁 Project Structure
bugtracker/

├── backend/          ← PHP API files

│   ├── config.php

│   ├── auth.php

│   ├── bugs.php

│   ├── users.php

│   ├── projects.php

│   └── upload.php

└── frontend/         ← React App

└── src/

├── pages/

│   ├── admin/

│   ├── staff/

│   └── customer/

└── components/
## ✨ Features
- ✅ Role-based login (Admin, Staff, Customer)
- ✅ Bug reporting with screenshot upload
- ✅ Ticket number generation
- ✅ Bug assignment to staff
- ✅ Real-time case flow tracking
- ✅ Messaging between admin, staff and customer
- ✅ Status updates (open, assigned, in progress, resolved, closed)