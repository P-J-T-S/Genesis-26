# 🛠️ GearGuard - Smart Maintenance Management System

**Hackathon:** Odoo Hack 2025 | **Team:** InnoBits | **Track:** Enterprise Operations

> Transforming chaotic maintenance workflows into organized, predictive operations through intelligent request routing and visual tracking.

---

## 🔗 Quick Links (For Real experience)


| 🚀 Live Demo | 🎥 Video Walkthrough | 📊 Presentation |
|:------------:|:-------------------:|:---------------:|
| [**Launch App**](https://frontend-wvdt.onrender.com/) | [**Watch Demo**](https://youtu.be/JTfW0U44ak0) | [**View PPT**](https://drive.google.com/file/d/1zxytV0PYG64SY2SNxegDR8UhI3cJml9J/view?usp=sharing) |

---

## 🎯 Problem Statement
Managing equipment maintenance in organizations is fragmented, leading to delayed repairs, missed preventive schedules, and poor visibility. Teams struggle to track breakdowns, assign responsibilities, and plan maintenance efficiently using traditional methods.

## 💡 Solution
A centralized maintenance tracking system connecting equipment, teams, and requests in one workflow. Real-time Kanban tracking, preventive calendar scheduling, and automated team assignment ensure faster, organized maintenance operations.

![](Frontend/public/overview.png)
---

## 🚀 Key Features

### ✅ Equipment Management
- Full CRUD operations (Add, View, Edit, Delete)
- Track: Name, Serial Number, Location, Assigned Team
- **Scrap functionality** to mark inactive equipment
- **"Maintenance" button** - Quick access to all related requests with pending count

### ✅ Maintenance Teams
- Create & manage specialized teams (Electrical, Mechanical, HVAC)
- Add/Remove technicians with role validation
- View team workload and assigned requests

### ✅ Maintenance Requests
- **Two types:** Corrective (breakdown) & Preventive (scheduled)
- **Auto-assign team** based on selected equipment
- **Status flow:** `NEW` → `IN_PROGRESS` → `REPAIRED` → `SCRAP`
- **Duration logging** when marking as repaired
- Filter by status, priority, type, equipment

### ✅ Kanban Board
- Visual 4-column layout by status
- **Drag-and-drop** status updates
- Overdue requests highlighted in red
- Priority badges (HIGH/MEDIUM/LOW)

### ✅ Preventive Calendar
- Monthly view with navigation
- **Click date** to create preventive request
- Visual indicators for scheduled maintenance
- Filter by month/year

### ✅ Dashboard
- Real-time stats: Equipment, Teams, Active Requests, Overdue
- Recent requests list
- Upcoming preventive maintenance
- Quick action buttons

### ✅ Authentication & Authorization
- JWT-based authentication (Access + Refresh tokens)
- Role-based access: `USER`, `TECHNICIAN`, `MANAGER`
- Protected routes with automatic token refresh

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18, Vite, TailwindCSS, React Router v6 |
| **Backend** | Node.js, Express.js, REST API |
| **Database** | MongoDB Atlas, Mongoose ODM |
| **Auth** | JWT (Access + Refresh Tokens), bcrypt |
| **State** | React Context API |
| **Icons** | Lucide React |

---

## ⚡ Quick Start

```bash
# Clone repository
git clone <repo-url>
cd Odoo-Hack-25

# Backend setup
cd Backend
npm install
cp .env.example .env  # Configure MongoDB URI & JWT secrets
npm run dev           # Runs on :5000

# Frontend setup (new terminal)
cd Frontend
npm install
npm run dev           # Runs on :5173
```

### Environment Variables

**Backend (.env)**
```env
MONGODB_URI=your_mongodb_connection_string
PORT=5000
ACCESS_TOKEN_SECRET=your_secret
REFRESH_TOKEN_SECRET=your_secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_EXPIRY=7d
CORS_ORIGIN=http://localhost:5173
```

**Frontend (.env)**
```env
VITE_API_URL=http://localhost:5000/api/v1
```



---

## 🔗 API Endpoints

| Module | Endpoints |
|--------|-----------|
| **Auth** | `POST /register`, `/login`, `/logout`, `/refresh-token` |
| **Equipment** | `GET/POST /equipment`, `PUT/DELETE /:id`, `PATCH /:id/scrap` |
| **Teams** | `GET/POST /teams`, `PUT/DELETE /:id`, `POST/DELETE /:id/technicians` |
| **Requests** | `GET/POST /requests`, `PATCH /:id/status`, `GET /kanban`, `/preventive` |

---

## 👥 Team InnoBits

| Member | Role |
|--------|------|
| [**Saman Pandey**](https://github.com/SamanPandey-in) | UI/UX Design & Documentation |
| [**Jagdish Padhi**](https://github.com/Jagdish-Padhi) | Backend, Database & Integration |
| [**Twinkle Gupta**](https://github.com/twinkle-2101) | Backend Development |
| [**Poorvaja Joshi**](https://github.com/poorvaja-1603) | Backend, Video & Docs |

---

## 🔮 Future Scope
- Email/Push notifications for overdue requests
- Advanced analytics dashboard
- Mobile app (React Native)
- IoT sensor integration for predictive maintenance

---

**Built with ❤️ for Odoo Hack 2025 by Team InnoBits**