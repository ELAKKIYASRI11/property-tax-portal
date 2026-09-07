# Web-Based Property Tax Self-Assessment & Payment Compliance Tracking Portal

### 🏛️ Sathyamangalam Municipality, Erode District, Tamil Nadu (Team VEM)

A full-stack municipal property tax web portal specialized for **Sathyamangalam Municipality, Tamil Nadu**. Powered by **Spring Boot**, **Java 21/25**, **MySQL 8.0**, and **React 19**.

Citizens can transparently self-assess and pay property taxes with auto-applied concessions, while municipal administrators manage **GIS satellite anomaly detection** for unassessed properties, dynamic **compliance risk scoring**, digitized **appeal/grievance adjudication**, and **predictive revenue forecasting**.

---

## 📍 Sathyamangalam Municipality Specialization

- **Municipality**: Sathyamangalam Municipality (Fixed)
- **District**: Erode District, Tamil Nadu
- **Postal PIN Code**: 638401
- **GIS Map Center**: `11.5092° N, 77.2347° E` (Sathyamangalam Town Center)
- **Administrative Wards**: All 27 municipal wards (`Ward 01` – `Ward 27`) with calibrated GIS coordinates and locality mappings.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
|---|---|
| **Backend** | Spring Boot 3.3.2, Java (OpenJDK 21/25), Spring Security 6 (Stateless JWT), Spring Data JPA, Hibernate, Maven Wrapper |
| **Database** | MySQL 8.0 (`sathy_tax_db`) |
| **Frontend** | React 19, Vite 8, Tailwind CSS, React Router v7, Lucide Icons, Axios |
| **GIS & Mapping** | Leaflet 1.9, React-Leaflet 5.0, OpenStreetMap, Custom SVG Markers |
| **Visual Analytics** | Recharts (Quarterly projection and ward realization charts) |

---

## 📐 5-Stage Valuation Formula

$$\text{Base Tax} = \text{Built-Up Area} \times \text{Zone Base Rate}$$
$$\text{Adjusted Base} = \text{Base Tax} \times \text{Usage Multiplier} \times \text{Building Construction Factor}$$
$$\text{Depreciated Tax} = \text{Adjusted Base} \times (1 - \text{Depreciation Rate})$$
$$\text{Gross Tax} = \text{Depreciated Tax} \times \text{Occupancy Factor}$$
$$\text{Final Net Tax} = \text{Gross Tax} - \sum(\text{Auto-Applied Exemptions}) + \text{Late Penalties}$$

### Auto-Applied Concessions:
- 👴 **Senior Citizen (Age $\ge$ 60)**: 15% statutory rebate on residential properties.
- 🏡 **Homestead Exemption**: 10% rebate for Owner-Occupied units.
- ♿ **Differently Abled Citizen**: 20% municipal concession.
- 🌾 **Agricultural Land Support**: 25% tax reduction.

---

## 🔑 Demo Login Credentials

The login screen includes **1-Click Quick-Fill buttons** for immediate testing:

| Role | Email | Password | Profile & Location |
|---|---|---|---|
| **Senior Citizen** | `raman@vem.gov.in` | `citizen123` | Ramanathan S (Age 70, **15% Senior Rebate**, Ward 10 Kamaraj Colony) |
| **Diff-Abled Citizen** | `ananya@vem.gov.in` | `citizen123` | Ananya Roy (**20% Disability Concession**, Ward 15 Housing Board Colony) |
| **Municipal Admin** | `admin@vem.gov.in` | `admin123` | Dr. K. Sundaram (**Sathyamangalam Municipal Commissioner**) |

---

## 🚀 How to Run

### 1. Prerequisites
- **Java 21 or higher** (`java -version`)
- **MySQL 8.0** running locally on port `3306`
- **Node.js** (v18+) & **npm**

### 2. Database Configuration
The backend connects to MySQL using settings in `backend/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/sathy_tax_db?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=velakkiyasri3
```
*Note: Demo data (users, properties, GIS parcels, assessments, notices) seeds automatically on first launch!*

### 3. Start Backend (Spring Boot)
In your first terminal:
```bash
cd "c:/Users/Elakkiyasri S/Desktop/Tax - java/backend"

# Build & run with Maven Wrapper
./mvnw.cmd spring-boot:run
# or run the pre-built jar:
java -jar target/property-tax-portal-1.0.0.jar
```
Backend API will be live at: 👉 **`http://localhost:8080/`**

### 4. Start Frontend (React + Vite)
In a second terminal:
```bash
cd "c:/Users/Elakkiyasri S/Desktop/Tax - java/frontend"
npm install
npm run dev
```
Frontend Web Portal will be live at: 👉 **`http://localhost:5173/`**

---

## 📡 REST API Reference

| Endpoint | Method | Access | Description |
|---|---|---|---|
| `/api/auth/register` | `POST` | Public | Register new taxpayer account |
| `/api/auth/login` | `POST` | Public | Authenticate user & return JWT token |
| `/api/auth/profile` | `GET` | Private | Retrieve current user profile |
| `/api/properties` | `GET` | Private | Retrieve logged-in user's properties |
| `/api/properties` | `POST` | Private | Register property with Sathyamangalam location & GIS pin |
| `/api/tax/preview` | `POST` | Private | Run live 5-stage tax calculation preview |
| `/api/tax/assess` | `POST` | Private | Commit formal self-assessment record |
| `/api/tax/my-assessments` | `GET` | Private | Get assessments for current user |
| `/api/payments/pay` | `POST` | Private | Process simulated online payment & generate receipt |
| `/api/payments/history` | `GET` | Private | Get complete payment transaction history |
| `/api/payments/receipt/{id}`| `GET` | Private | Retrieve printable municipal tax receipt |
| `/api/grievances` | `POST` | Private | File dispute appeal with blueprint proof upload |
| `/api/grievances/my` | `GET` | Private | View citizen's submitted dispute appeals |
| `/api/admin/stats` | `GET` | Admin | Municipal overview KPIs & compliance distribution |
| `/api/admin/gis-layer` | `GET` | Admin | Verified properties + Sathyamangalam unassessed parcels |
| `/api/admin/unassessed/{id}/notice` | `POST` | Admin | Issue Section 112 statutory survey notice |
| `/api/admin/revenue-forecast` | `GET` | Admin | Recharts quarterly revenue projection model |
| `/api/admin/grievances` | `GET` | Admin | View all citizen dispute appeals |
| `/api/admin/grievances/{id}` | `PUT` | Admin | Adjudicate appeal (Approve/Reject) & adjust tax dues |
| `/api/notifications` | `GET` | Private | Fetch alerts and due reminders |
| `/api/notifications/{id}/read` | `PUT` | Private | Mark notification(s) as read |
| `/uploads/{fileName}` | `GET` | Public | Serve uploaded dispute evidence attachments |

---

## 🏛️ Team VEM
Designed and customized specifically for **Sathyamangalam Municipality, Erode District, Tamil Nadu**.
