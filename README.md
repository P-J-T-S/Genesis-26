# � Genesis-26 - Adaptive Waste Planning & Decision Support for BMC SWM

**Challenge:** SO1 - Solid Waste Management Smart Operations | **Organization:** Brihanmumbai Municipal Corporation (BMC) | **Track:** Smart City Operations

> Converting waste signals into actionable operational decisions for BMC's Solid Waste Management, enabling adaptive planning across normal days, events, hotspots, and emergencies.

---

## 🎯 Problem Statement
BMC's Solid Waste Management operates on fixed daily collection schedules that work on regular days but struggle during festivals, events, hotspots, and emergencies. While BMC receives digital signals (complaints, alerts, ward data), there is no unified system that anticipates waste pressure, prioritizes locations, and supports rapid operational decisions for waste collection and handling.

## 💡 Solution
A decision-support layer that interprets waste signals, identifies high-risk areas, calculates dynamic priorities, and recommends adaptive collection strategies. It assists SWM supervisors in planning, prioritization, and rapid response without replacing existing citizen-facing platforms.

# 📍 [Live HERE](https://github.com/P-J-T-S/Genesis-26/edit/main/README.md)


---

## 🚀 Key Features

### ✅ Real-Time Waste Signal Integration
- Aggregates citizen complaints from multiple channels
- Broadcasts weather and civic alerts (rain, flood, outbreak)
- Logs waste events and incidents with auto-zone assignment
- Unified signal dashboard for supervisors

### ✅ Intelligent Hotspot Detection
- AI-based identification of high-risk waste concentration areas
- Geospatial clustering and anomaly detection
- Spike prediction for sudden waste surges
- Risk scoring and hotspot visualization

### ✅ Dynamic Priority Calculation
- Ranks zones by waste pressure, complaints, and risk factors
- Adjusts priorities based on events, weather, and trends
- Priority tiers: High, Medium, Low for resource allocation
- Real-time reordering as conditions change

### ✅ Adaptive Scheduling & Planning
- Optimizes collection schedules for normal operations
- Adjusts frequency for event-driven high-waste days
- Manages recurring hotspot zones with continuous attention
- Supports rapid reallocation during emergencies

### ✅ Decision Support Recommendations
- AI-generated resource allocation suggestions
- Optimal vehicle routing and crew deployment
- Peak hour identification for collection planning
- Actionable insights for SWM supervisors

### ✅ Role-Based Operations Dashboard
- **Ward Officers:** Ward-specific data, alerts, local decisions
- **Zonal Supervisors:** Zone-wide insights, inter-ward comparisons, resource distribution
- **City Head:** City-wide metrics, hotspot overview, strategic planning
- Real-time KPIs and performance tracking

### ✅ Advanced Analytics & Intelligence
- Historical trend analysis and pattern recognition
- Complaint correlation with waste accumulation
- Seasonal and event-driven impact assessment
- Predictive modeling for waste generation

### ✅ Authentication & Authorization
- JWT-based authentication (Access + Refresh tokens)
- Role-based access: `WARD_OFFICER`, `ZONAL_SUPERVISOR`, `CITY_HEAD`
- Protected operations with automatic token refresh

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 19, Vite, TailwindCSS, React Router v7 |
| **Backend** | Node.js, Express.js 5.x, REST API |
| **Database** | MongoDB Atlas, Mongoose v9, Geospatial Indexes |
| **Real-Time** | Socket.io (WebSocket), Redux Toolkit |
| **Mapping** | Leaflet, React-Leaflet, GeoJSON |
| **Auth** | JWT (Access + Refresh Tokens), bcrypt |
| **UI** | Material-UI, Lucide React Icons |
| **Testing** | Jest, Supertest, MongoDB Memory Server |

---

## ⚡ Quick Start

```bash
# Clone repository
git clone <repo-url>
cd Genesis-26

# Backend setup
cd Backend
npm install
cp .env.example .env  # Configure MongoDB URI & JWT secrets
npm run dev           # Runs on :8000

# Frontend setup (new terminal)
cd Frontend
npm install
npm run dev           # Runs on :5173
```

### Environment Variables

**Backend (.env)**
```env
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/genesis26
PORT=8000
JWT_ACCESS_SECRET=your_access_secret_key
JWT_REFRESH_SECRET=your_refresh_secret_key
JWT_ACCESS_EXPIRY=900
JWT_REFRESH_EXPIRY=604800
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
```

**Frontend (.env)**
```env
VITE_API_URL=http://localhost:8000/api/v1
VITE_SOCKET_URL=http://localhost:8000
```

---

## 🔗 API Endpoints

| Module | Endpoints |
|--------|-----------|
| **Auth** | `POST /auth/signup`, `/auth/login`, `/auth/logout`, `/auth/refresh-token` |
| **Zones** | `GET /zones`, `/zones/status`, `/zones/:id`, `POST /zones/mode` |
| **Signals** | `POST /signals/complaint`, `/signals/event`, `/signals/alert` |
| **Priority** | `GET /priority`, `POST /intelligence/hotspots`, `/intelligence/spikes` |
| **Recommendations** | `GET /recommendations/:zoneId`, `POST /wpi/run` |
| **Feed** | `GET /feed` |

---

## 👥 Team Genesis-26

| Member | Role |
|--------|------|
| [**Saman Pandey**](https://github.com/SamanPandey-in) | UI/UX Design & Documentation |
| [**Jagdish Padhi**](https://github.com/Jagdish-Padhi) | Backend, Database & Integration |
| [**Twinkle Gupta**](https://github.com/twinkle-2101) | Backend Development |
| [**Poorvaja Joshi**](https://github.com/poorvaja-1603) | ML, Analytics & Docs |

---

## 🔮 Future Scope
- Email/SMS notifications for alerts and recommendations
- Advanced predictive analytics dashboard
- Mobile app for field operations
- Integration with BMC legacy systems
- IoT sensor integration for real-time waste levels
- Machine learning model improvements for spike prediction

---

**Built with ❤️ for BMC Solid Waste Management Smart Operations - Genesis-26**
