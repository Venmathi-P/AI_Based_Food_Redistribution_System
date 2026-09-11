# 🍽️ FoodBridge AI
### AI-Based Food Redistribution System for Waste Reduction and Surplus Inventory Management

![Python](https://img.shields.io/badge/Python-3.x-blue)
![React](https://img.shields.io/badge/React-Vite-cyan)
![FastAPI](https://img.shields.io/badge/FastAPI-Backend-teal)
![MySQL](https://img.shields.io/badge/MySQL-Database-orange)
![AI](https://img.shields.io/badge/AI-Prophet%20%7C%20LSTM-purple)

## 🌟 Project Overview

**FoodBridge AI** is a full-stack food redistribution platform designed to reduce avoidable food waste by helping businesses identify surplus or near-expiry food and connect it with NGOs and community organizations.

The system combines **inventory management, expiry monitoring, AI-based waste prediction, demand forecasting, surplus donation management, and NGO redistribution workflows** in one web application.

The main idea is simple:

> **Identify food that may be wasted → recommend the right action → redistribute usable surplus to people who need it.**

---

## 🎯 Project Objectives

- Reduce food waste caused by excess inventory and approaching expiry.
- Help businesses maintain and monitor their food inventory.
- Predict potential food waste using AI-based analysis.
- Provide demand forecasts to support better purchasing decisions.
- Automatically identify products that require attention.
- Allow businesses to publish surplus food for donation.
- Help NGOs discover and accept available food donations.
- Manage pickup scheduling and donation completion.
- Provide a transparent workflow from inventory to redistribution.
- Support multiple business users with isolated inventory data.

---

## 🏗️ System Architecture

The application follows a **React + FastAPI + MySQL** architecture.

```text
                  ┌───────────────────────────────┐
                  │        React + Vite UI        │
                  │  Business / NGO Dashboards    │
                  └───────────────┬───────────────┘
                                  │
                              REST API
                                  │
                  ┌───────────────▼───────────────┐
                  │          FastAPI Backend       │
                  │ Authentication / Inventory    │
                  │ Donations / Dashboard / AI    │
                  └───────────────┬───────────────┘
                                  │
                       SQLAlchemy ORM
                                  │
                  ┌───────────────▼───────────────┐
                  │         MySQL Database         │
                  │ Users / Inventory / Donations │
                  └───────────────────────────────┘
                                  │
                  ┌───────────────▼───────────────┐
                  │       AI Prediction Layer      │
                  │ Prophet / LSTM / Risk Logic   │
                  └───────────────────────────────┘
```

---

## 📦 Major Modules

### 1. 🔐 Authentication & Role Management

The platform supports role-based access for:

- **Business users**
- **NGO users**

Authentication is handled using **JWT tokens**. The logged-in user's identity is used to associate inventory and donation records with the correct business or NGO.

---

### 2. 📋 Inventory Management

Businesses can manage their food inventory through multiple methods:

- Manual inventory entry
- Inventory editing
- Inventory deletion
- CSV bulk upload
- POS synchronization
- Barcode information
- Product category
- Storage type
- Purchase date
- Expiry date
- Quantity tracking

The inventory table provides a central view of the products currently registered by a business.

---

### 3. ⏰ Expiry Monitoring & Alerts

The system continuously evaluates product expiry dates.

Products are categorized according to their remaining shelf life and can be highlighted as:

- **Low Risk**
- **Medium Risk**
- **High Risk**
- **Critical / Expired**, depending on the AI and expiry analysis

Recommended actions can include:

- Keep in inventory
- Donate soon
- Donate immediately

This helps businesses act before usable food becomes waste.

---

### 4. 🏷️ Product Classification

The system supports product classification based on food type and storage requirements.

Examples include:

- Dairy
- Bakery
- Fruits
- Vegetables
- Grains
- Meat
- Seafood

Storage information can also be maintained, such as:

- Refrigerated
- Freezer
- Dry Storage
- Room Temperature

---

## 🤖 AI-Based Waste Prediction

One of the main components of FoodBridge AI is its **AI waste prediction engine**.

The system analyzes inventory information together with demand-related information to estimate the likelihood of food waste.

### Waste Risk Factors

The risk calculation considers factors such as:

- Remaining expiry time
- Current inventory quantity
- Expected demand / consumption

A composite score is used to classify products into risk levels.

```text
                Inventory Information
                         │
             ┌───────────┼───────────┐
             ▼           ▼           ▼
          Expiry      Quantity     Demand
             │           │           │
             └───────────┼───────────┘
                         ▼
                AI Waste Risk Score
                         │
              ┌──────────┼──────────┐
              ▼          ▼          ▼
            LOW       MEDIUM      HIGH/CRITICAL
              │          │             │
              ▼          ▼             ▼
           Monitor    Donate Soon   Donate Now
```

---

## 📈 Demand Forecasting

The project uses time-series and neural-network approaches for demand prediction.

### Prophet

**Prophet** is used for time-series forecasting and can capture patterns such as:

- Trends
- Seasonal demand
- Historical consumption patterns

### LSTM

An **LSTM (Long Short-Term Memory)** neural network is also incorporated for demand forecasting.

LSTM is useful for learning patterns from sequential historical data and predicting future demand.

### Forecast Output

The prediction component can provide future demand estimates that can be used by the waste-risk and inventory decision logic.

---

## 🛒 Smart Reorder Recommendation

The AI analysis can also support inventory purchasing decisions.

The system considers:

- Current stock
- Expected demand
- Storage capacity
- Lead time
- Safety stock

The goal is to avoid unnecessary purchasing when an item already has a high probability of becoming waste.

---

## 🤝 Surplus Food Redistribution

When a business identifies usable surplus food, it can create a donation from an inventory item.

The donation workflow is:

```text
Business Inventory
       │
       ▼
Identify Surplus / Near-Expiry Food
       │
       ▼
Create Donation
       │
       ▼
Available to NGOs
       │
       ▼
NGO Accepts Donation
       │
       ▼
Pickup Scheduled
       │
       ▼
Pickup Completed
       │
       ▼
Donation History
```

This creates a clear end-to-end redistribution process.

---

## 🏢 Business Dashboard

Business users can manage their operations through the business interface.

Typical functions include:

- Dashboard overview
- Inventory management
- Expiry alerts
- AI analysis
- CSV upload
- POS synchronization
- Surplus donation creation
- Donation tracking

The inventory page acts as the main location for viewing manually added and synchronized inventory.

---

## 🏠 NGO Dashboard

NGO users can participate in the redistribution process.

The NGO workflow includes:

- View available donations
- Accept suitable donations
- View accepted donations
- Schedule pickups
- Track scheduled pickups
- Complete pickups
- View donation history

This separates the responsibilities of food donors and food recipients.

---

## 📱 QR Code Support

The inventory interface supports QR code generation for inventory records.

The current QR value follows the inventory identifier format:

```text
INV-{inventory_id}
```

Example:

```text
INV-65
```

This provides a quick way to associate a QR code with an inventory record during demonstrations or future scanning workflows.

> **Note:** Browser-based live camera scanning requires a secure browser context such as HTTPS or localhost. QR image/scanning workflows can be used as an alternative when running the project on a local network.

---

## 🔄 POS Synchronization

FoodBridge AI provides a POS synchronization endpoint that can be used to add or update inventory from an external POS system.

The synchronization logic can:

- Add a new product
- Match an existing product using its barcode
- Update quantity
- Update expiry information

This helps reduce manual inventory entry for businesses that already use a POS system.

---

## 📄 CSV Bulk Upload

Businesses can upload inventory data in CSV format.

Typical fields include:

```text
product_name
category
quantity
purchase_date
expiry_date
storage_type
barcode
```

This is useful when a business has many inventory records and entering each item manually would be inefficient.

---

## 🗄️ Database Design

The application uses **MySQL** with **SQLAlchemy ORM**.

Important entities include:

```text
Users
  │
  ├── Business Users
  └── NGO Users

Inventory
  │
  └── belongs to Business

Donations
  │
  ├── created from Inventory
  ├── belongs to Business
  └── can be assigned to an NGO
```

Business-specific inventory is associated with the authenticated user's business ID to support multi-user data separation.

---

## 🧰 Technology Stack

### Frontend

- **React**
- **Vite**
- **JavaScript / JSX**
- **React Router**
- **Axios**
- **Bootstrap / CSS**
- **Recharts** for data visualization
- **QRCode** for QR generation

### Backend

- **Python**
- **FastAPI**
- **SQLAlchemy**
- **Pydantic**
- **Uvicorn**
- **JWT Authentication**

### Database

- **MySQL**
- **PyMySQL**

### AI & Data Processing

- **Pandas**
- **NumPy**
- **Prophet**
- **LSTM**
- Time-series preprocessing
- Waste-risk scoring
- Demand prediction

---

## 📁 Project Structure

```text
AI-Based-Food-Redistribution-System/
│
├── backend/
│   ├── app/
│   │   ├── ai/
│   │   │   ├── waste_prediction.py
│   │   │   ├── train_prophet.py
│   │   │   └── predict_demand.py
│   │   │
│   │   ├── config/
│   │   │   ├── database.py
│   │   │   ├── auth.py
│   │   │   ├── security.py
│   │   │   └── settings.py
│   │   │
│   │   ├── models/
│   │   │   ├── user.py
│   │   │   ├── inventory.py
│   │   │   └── donation.py
│   │   │
│   │   ├── routes/
│   │   │   ├── auth.py
│   │   │   ├── inventory.py
│   │   │   ├── donation.py
│   │   │   ├── dashboard.py
│   │   │   └── ai.py
│   │   │
│   │   ├── schemas/
│   │   │   ├── inventory.py
│   │   │   └── user.py
│   │   │
│   │   ├── utils/
│   │   │   └── expiry.py
│   │   │
│   │   └── main.py
│   │
│   ├── requirements.txt
│   └── venv/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── InventoryForm.jsx
│   │   │   ├── InventoryTable.jsx
│   │   │   ├── CSVUpload.jsx
│   │   │   ├── POSSync.jsx
│   │   │   ├── ExpiryAlert.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── Navbar.jsx
│   │   │
│   │   ├── layouts/
│   │   │   └── BusinessLayout.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Inventory.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── ...
│   │   │
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   └── donationService.js
│   │   │
│   │   └── ...
│   │
│   └── package.json
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Install the following before running the project:

- Python 3.x
- Node.js and npm
- MySQL
- Git

---

## 1️⃣ Database Setup

Create the MySQL database:

```sql
CREATE DATABASE food_redistribution;
```

Configure the database connection in the backend configuration.

Example:

```text
mysql+pymysql://root:YOUR_PASSWORD@localhost:3306/food_redistribution
```

Do not commit real database passwords to GitHub.

---

## 2️⃣ Backend Setup

Open a terminal and move into the backend directory:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate it on Windows:

```bash
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Start the FastAPI server:

```bash
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

The backend will be available at:

```text
http://127.0.0.1:8000
```

FastAPI Swagger documentation:

```text
http://127.0.0.1:8000/docs
```

---

## 3️⃣ Frontend Setup

Open another terminal:

```bash
cd frontend
```

Install packages:

```bash
npm install
```

Start the Vite development server:

```bash
npm run dev
```

The frontend normally runs at:

```text
http://localhost:5173
```

---

## 🔌 Main API Endpoints

### Authentication

```text
POST /auth/register
POST /auth/login
```

### Inventory

```text
POST   /inventory/add
GET    /inventory
GET    /inventory/{id}
PUT    /inventory/{id}
DELETE /inventory/{id}
POST   /inventory/upload-csv
POST   /inventory/pos-sync
GET    /inventory/expiry-alerts/{business_id}
GET    /inventory/categorize/{product_name}
GET    /inventory/category-summary
```

### Donations

```text
POST /donations/{inventory_id}
GET  /donations/available
PUT  /donations/{donation_id}/accept
GET  /donations/accepted
PUT  /donations/{donation_id}/schedule
GET  /donations/scheduled
PUT  /donations/{donation_id}/complete
GET  /donations/history
```

> Donation routes should enforce the appropriate Business/NGO permissions on the backend.

---

## 🔐 Security Considerations

The project uses JWT-based authentication to protect API requests.

Important security practices:

- Keep JWT secrets private.
- Do not commit passwords or database credentials.
- Validate all inventory dates and quantities.
- Verify that a business can access only its own inventory.
- Verify that an NGO can accept or manage only donations assigned to it.
- Perform role validation on the backend rather than relying only on frontend restrictions.

---

## 🧪 Testing & Verification

During development, individual modules can be verified through:

- FastAPI Swagger UI
- Browser developer tools
- MySQL queries
- Frontend workflows
- API request/response validation

Swagger is available at:

```text
http://127.0.0.1:8000/docs
```

Example development checks include:

```text
✓ User registration
✓ User login
✓ Inventory creation
✓ Inventory retrieval
✓ Inventory update
✓ Inventory deletion
✓ CSV upload
✓ POS synchronization
✓ Expiry alert generation
✓ AI waste analysis
✓ Donation creation
✓ NGO donation acceptance
✓ Pickup scheduling
✓ Donation completion
```

---

## 🗺️ Project Development Roadmap

### Phase 1 — Authentication & Basic Platform
- User registration
- Login
- JWT authentication
- Business and NGO roles

### Phase 2 — Inventory Management
- Manual inventory entry
- CRUD operations
- CSV upload
- POS synchronization
- Product classification
- Expiry tracking

### Phase 3 — AI Waste Prediction
- Historical data preprocessing
- Demand forecasting
- Prophet model
- LSTM model
- Waste-risk scoring
- Reorder recommendations

### Phase 4 — Food Redistribution
- Surplus donation creation
- NGO available-donation feed
- Donation acceptance
- Pickup scheduling
- Completion tracking
- Donation history

### Phase 5 — Sustainability & Future Enhancements
- Impact analytics
- Waste diverted metrics
- Meals supported
- CO₂ impact estimation
- Advanced NGO matching
- Deployment and production optimization

---

## 🌱 Expected Impact

FoodBridge AI aims to create a practical digital workflow for reducing food waste.

### For Businesses

- Better inventory visibility
- Earlier identification of expiry risks
- Data-driven purchasing decisions
- Simple surplus donation process
- Reduced avoidable food waste

### For NGOs

- Easier access to available food donations
- Faster donation acceptance
- Organized pickup coordination
- Better visibility of donation history

### For the Community

- More surplus food reaches people instead of being discarded.
- Food redistribution becomes easier to coordinate.
- Businesses and NGOs can participate through one platform.

---

## 👥 Project Workflow

```text
       BUSINESS
          │
          ▼
   Add / Sync Inventory
          │
          ▼
    Expiry + AI Analysis
          │
      ┌───┴────┐
      ▼        ▼
   Keep     Donate
   Stock      │
              ▼
       NGO Available Feed
              │
              ▼
       NGO Accepts Food
              │
              ▼
       Pickup Scheduling
              │
              ▼
       Pickup Completed
              │
              ▼
       Redistribution
              │
              ▼
        Social Impact
```

---

## 📌 Project Highlights

- Full-stack web application
- React-based responsive interface
- FastAPI REST backend
- MySQL database
- JWT authentication
- Business and NGO role separation
- Manual, CSV and POS inventory ingestion
- Expiry monitoring
- AI-based waste prediction
- Prophet demand forecasting
- LSTM-based forecasting
- Smart inventory recommendations
- Surplus donation workflow
- NGO acceptance and pickup management
- QR code support
- Multi-business inventory isolation

---

## 📄 Project Title

**AI-Based Food Redistribution System for Waste Reduction and Surplus Inventory Management**

### Short Name

**FoodBridge AI**

### Project Purpose

**To reduce food waste by using AI-driven inventory analysis and connecting businesses with NGOs for timely redistribution of surplus food.**

---

## ⭐ Conclusion

FoodBridge AI combines **software engineering, artificial intelligence, inventory management, and social impact** into a single platform.

Instead of treating food waste only as a disposal problem, the system attempts to identify potential waste early and redirect usable food through an organized business-to-NGO workflow.

The project demonstrates how AI and web technologies can be applied to build a practical solution for **food waste reduction and surplus food redistribution**.
