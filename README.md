# Web-Based Property Tax Self-Assessment & Payment Compliance Tracking Portal (Team VEM)

A full-stack **MERN** (MongoDB, Express, React, Node.js) web platform empowering citizens to transparently self-assess and pay municipal property taxes with auto-applied concessions, while equipping municipal administrators with **GIS-based satellite anomaly detection** for unassessed properties, dynamic **compliance risk scoring**, digitized **appeal/grievance adjudication**, and **predictive revenue forecasting**.

---

## 🏛️ Project Highlights & Novelty Differentiators

Unlike traditional CRUD tax trackers, this portal addresses the critical municipal research gap of **unidentified and unrecorded real estate parcels** and manual assessment bias:

1. **GIS Satellite Verification & Anomaly Detection (Headline Novelty)**:
   - Interactive **Leaflet / OpenStreetMap** spatial engine plotting registered properties (**Green Pins**) alongside satellite-detected unregistered built structures (**Pulsing Red Alert Pins**).
   - Real-time tax leakage estimates per unassessed parcel with one-click statutory **Section 112 Compliance Survey Notice** dispatch.
2. **Dynamic Compliance Score & Risk Rating Engine**:
   - Auto-computed 0–100 score and color-coded badge per property:
     - 🟢 **Good Standing (80–100)**: Clean record, zero arrears, prompt payments.
     - 🟡 **At Risk (50–79)**: Minor delays or pending cycle notices.
     - 🔴 **Defaulter Risk (<50)**: Overdue liabilities subject to recovery and statutory penalties.
3. **Digitized Tax Appeal & Grievance Workflow**:
   - Citizens can dispute assessments (incorrect built-up area, wrong zone, missing rebate) and attach evidence (survey blueprints, title deeds via Multer).
   - Municipal assessors audit proofs, adjust the final tax liability, record official remarks, and issue binding determinations.
4. **Auto-Applied Profile Exemptions**:
   - Concessions are automatically applied during self-assessment directly from taxpayer attributes, eliminating manual discretion:
     - 👴 **Senior Citizen (Age $\ge$ 60)**: 15% statutory rebate on residential properties.
     - 🏡 **Homestead Exemption**: 10% rebate for Owner-Occupied units.
     - ♿ **Differently Abled Citizen**: 20% municipal concession.
     - 🌾 **Agricultural Land Support**: 25% tax reduction.
5. **Predictive Revenue Forecasting (Decision-Support Analytics)**:
   - Interactive **Recharts** quarterly projection model on the Admin dashboard.
   - Reframes the portal from a transactional log into a municipal decision-support tool using historical collection trajectories and ward-wise realization ratios.

---

## 📐 5-Stage Valuation Formula

$$\text{Base Tax} = \text{Built-Up Area} \times \text{Zone Base Rate}$$
$$\text{Adjusted Base} = \text{Base Tax} \times \text{Usage Multiplier} \times \text{Building Construction Factor}$$
$$\text{Depreciated Tax} = \text{Adjusted Base} \times (1 - \text{Depreciation Rate})$$
$$\text{Gross Tax} = \text{Depreciated Tax} \times \text{Occupancy Factor}$$
$$\text{Final Net Tax} = \text{Gross Tax} - \sum(\text{Auto-Applied Exemptions}) + \text{Late Penalties}$$

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
|---|---|
| **Frontend** | React 19, Vite 8, Tailwind CSS, React Router v7, Lucide Icons, Axios |
| **Mapping & GIS** | Leaflet 1.9, React-Leaflet 5.0, OpenStreetMap, Custom SVG Markers |
| **Visual Analytics** | Recharts (Composed Area/Line/Bar charts) |
| **Backend** | Node.js (v22), Express.js, JWT (jsonwebtoken), bcryptjs, Multer |
| **Database** | MongoDB 8.2 (Mongoose 8 ODM) • Compatible with **MongoDB Compass** |

---

## 🚀 Quick Start & Local Setup

### 1. Prerequisites
- **Node.js** (v18 or higher recommended)
- **MongoDB** running locally on port `27017` (Default connection string: `mongodb://127.0.0.1:27017/property_tax_portal`)

### 2. Clone or Navigate to Project
```bash
cd "c:/Users/Elakkiyasri S/Documents/property-tax-portal"
```

### 3. Backend Setup
```bash
cd server
npm install

# Seed demo data (Citizens, Properties, Assessments, GIS Parcels, Grievances)
node seed.js

# Start the Express server (Runs on port 5000)
node server.js
```

### 4. Frontend Setup
Open a new terminal window:
```bash
cd client
npm install

# Start Vite dev server (Runs on port 5173)
npm run dev
```

### 5. Access the Web Application
Open your browser and navigate to:
👉 **[http://localhost:5173/](http://localhost:5173/)**

---

## 🔑 Demo Login Credentials

The login screen includes **1-Click Quick-Fill buttons** for instant testing:

| Role | Email | Password | Features / Focus |
|---|---|---|---|
| **Senior Citizen** | `raman@vem.gov.in` | `citizen123` | Ramanathan S (Age 70, **15% Senior Rebate**, 3 Properties) |
| **Diff-Abled Citizen** | `ananya@vem.gov.in` | `citizen123` | Ananya Roy (**20% Disability Rebate**, RS Puram Flat) |
| **Municipal Admin** | `admin@vem.gov.in` | `admin123` | Dr. K. Sundaram (**GIS Satellite Map, Forecasting, Appeals Audit**) |

---

## 📂 Project Structure

```
property-tax-portal/
├── README.md
├── server/
│   ├── .env                      # Server configuration (PORT, MONGO_URI, JWT_SECRET)
│   ├── server.js                 # Express entry point & route mounting
│   ├── seed.js                   # Realistic municipal database seeder
│   ├── config/
│   │   └── db.js                 # MongoDB connection using Mongoose
│   ├── models/
│   │   ├── User.js               # Citizen & Admin profiles, DOB, disability flags
│   │   ├── Property.js           # Spatial properties, location hierarchy, GIS coordinates
│   │   ├── Assessment.js         # 5-stage calculation breakdowns, dues, and statuses
│   │   ├── Payment.js            # Transaction logs and stamped municipal receipts
│   │   ├── Grievance.js          # Digitized dispute appeals and document links
│   │   ├── UnassessedParcel.js   # GIS satellite anomaly models and tax loss estimates
│   │   └── Notification.js       # Alerts, payment reminders, and overdue notices
│   ├── controllers/              # RESTful API controllers
│   ├── middleware/
│   │   ├── auth.js               # JWT verification & Admin role guard
│   │   └── upload.js             # Multer document upload handler
│   ├── routes/                   # Express routes (/api/auth, /api/tax, /api/admin, etc.)
│   ├── services/
│   │   ├── taxEngine.js          # 5-stage valuation & rebate algorithm
│   │   └── complianceScoreEngine.js # 0-100 risk score and badge calculator
│   └── uploads/                  # Storage directory for citizen dispute proof documents
│
└── client/
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── src/
    │   ├── main.jsx              # React DOM render
    │   ├── App.jsx               # Route mapping & ProtectedRoute wrappers
    │   ├── index.css             # Tailwind directives & print receipt stylesheet
    │   ├── context/
    │   │   └── AuthContext.jsx   # Global session state, login, register, logout
    │   ├── services/
    │   │   └── api.js            # Axios client with JWT bearer interceptors
    │   ├── components/
    │   │   ├── Navbar.jsx        # Navigation bar, role badges, notifications trigger
    │   │   ├── ComplianceBadge.jsx # Color-coded Good/At Risk/Defaulter badge
    │   │   ├── PropertyMap.jsx   # Interactive Leaflet map with custom SVG pins
    │   │   ├── ReceiptModal.jsx  # Official printable municipal tax payment receipt
    │   │   └── NotificationDrawer.jsx # Slide-over municipal alerts feed
    │   └── pages/
    │       ├── Login.jsx         # Authentication page with 1-click test profiles
    │       ├── Register.jsx      # Citizen enrollment with auto-exemption triggers
    │       ├── Dashboard.jsx     # Citizen portfolio overview & pending dues
    │       ├── Properties.jsx    # Property management & GIS pin placement
    │       ├── TaxCalculator.jsx # 5-stage self-assessment & online payment gateway
    │       ├── PaymentHistory.jsx # Transaction logs & printable receipt viewer
    │       ├── Grievances.jsx    # Citizen appeal submission & proof attachment
    │       ├── AdminDashboard.jsx # Municipal KPIs, risk distribution & revenue forecast
    │       ├── AdminGisMap.jsx   # GIS satellite anomaly inspection & survey notices
    │       └── AdminGrievances.jsx # Adjudication desk for reviewing citizen appeals
```

---

## 📡 REST API Reference

| Endpoint | Method | Access | Description |
|---|---|---|---|
| `/api/auth/register` | `POST` | Public | Register new citizen/admin account |
| `/api/auth/login` | `POST` | Public | Authenticate user & return JWT token |
| `/api/properties` | `GET` | Private | Retrieve logged-in user's properties |
| `/api/properties` | `POST` | Private | Add property with location hierarchy & GIS coordinates |
| `/api/tax/preview` | `POST` | Private | Run live 5-stage tax calculation preview |
| `/api/tax/assess` | `POST` | Private | Commit formal self-assessment record |
| `/api/tax/my-assessments`| `GET` | Private | Get assessments for current user |
| `/api/payments/pay` | `POST` | Private | Process simulated online payment & generate receipt |
| `/api/payments/history` | `GET` | Private | Get complete payment transaction history |
| `/api/grievances` | `POST` | Private | File dispute appeal with proof document attachment |
| `/api/grievances/my` | `GET` | Private | View citizen's submitted appeals and statuses |
| `/api/admin/stats` | `GET` | Admin | Aggregate municipal KPIs & compliance breakdown |
| `/api/admin/gis-layer` | `GET` | Admin | Fetch verified properties + unassessed anomaly parcels |
| `/api/admin/unassessed/:id/notice` | `POST` | Admin | Issue Section 112 compliance survey notice |
| `/api/admin/revenue-forecast` | `GET` | Admin | Get quarterly revenue forecasting data (Recharts) |
| `/api/admin/grievances` | `GET` | Admin | View all citizen dispute appeals |
| `/api/admin/grievances/:id` | `PUT` | Admin | Adjudicate appeal (Approve/Reject) & adjust tax liability |
| `/api/notifications` | `GET` | Private | Fetch alerts and due reminders |

---

## 🖨️ Printable Official Municipal Receipts

When a payment is processed via the online gateway:
- An official electronic tax payment receipt is generated with a unique **Receipt Number** (`RCPT-YYYY-XXXXXX`), **Transaction ID**, and municipal validation seal.
- Clicking **Print Receipt** formats the receipt using specialized `@media print` CSS, stripping navigation elements for paper or PDF export.

---

## 👥 Team VEM
Designed and developed for modern, transparent municipal revenue administration and citizen empowerment.
