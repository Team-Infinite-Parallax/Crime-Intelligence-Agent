# 🚨 Crime Intelligence Agent
> **AI-Driven Crime Analytics & Visualization Command Center for the Karnataka State Police**

---

<div align="center">
  <img src="./client/src/assets/emblem.svg" alt="KSP Emblem" width="100" style="margin-bottom: 20px;" />
  <p><strong>Transforming Law Enforcement from Reactive Record-Keeping to a Proactive Strategic Intelligence Hub</strong></p>

  <p>
    <a href="#-the-challenge">The Challenge</a> •
    <a href="#-the-solution">The Solution</a> •
    <a href="#-architecture--data-flow">Architecture</a> •
    <a href="#-key-features">Key Features</a> •
    <a href="#%EF%B8%8F-zoho-catalyst-ecosystem-integration">Catalyst Ecosystem</a> •
    <a href="#-getting-started">Getting Started</a> •
    <a href="#-demo-access">Demo Access</a>
  </p>

  <p>
    <img src="https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge&logo=opensourceinitiative&logoColor=white" alt="License" />
    <img src="https://img.shields.io/badge/React-18-61DAFB.svg?style=for-the-badge&logo=react&logoColor=black" alt="React" />
    <img src="https://img.shields.io/badge/Node.js-18.x-339933.svg?style=for-the-badge&logo=node.js&logoColor=white" alt="Node" />
    <img src="https://img.shields.io/badge/Python-3.13-3776AB.svg?style=for-the-badge&logo=python&logoColor=white" alt="Python" />
    <img src="https://img.shields.io/badge/Zoho--Catalyst-Cloud-orange.svg?style=for-the-badge" alt="Zoho Catalyst" />
  </p>
</div>

---

## 📋 The Challenge: Moving Beyond Manual Records

The Karnataka State Police (KSP) manages extensive crime records covering incidents, offenders, and victims. However, the current analytical ecosystem faces significant hurdles:
* 🗄️ **Data Silos & Manual Processes**: Records are managed in independent silos, heavily reliant on manual Excel-based reporting instead of integrated, automated systems.
* 🧠 **Lack of Advanced Analytics**: No AI-driven approaches, leaving deeper behavioral patterns, social interactions, and interconnected criminal networks undiscovered.
* ⚠️ **Information Gaps**: The State Crime Records Bureau (SCRB) receives limited, fragmented information, hindering comprehensive state-wide analysis.
* 🚓 **Reactive vs. Proactive**: Policing remains reactive; without a systematic exploration of emerging trends, investigators lack the tools for proactive strategies and evidence-based prevention.

---

## 💡 The Solution: Crime Intelligence & Analytical Platform

**Crime Intelligence Agent** transitions KSP operations to a **Strategic Intelligence Hub** using relational database structures, geospatial mapping, network link graphs, and advanced machine learning models:
* **Interactive Command Dashboards**: Geospatial maps and district drill-downs.
* **Criminological Link Analysis**: Suspect-victim-location networks.
* **Socio-Economic Correlation**: Overlaying crime statistics with population densities, poverty rates, and literacy.
* **AI-Driven Forecasting**: Spatiotemporal hotspot forecasting, chargesheet predictions, and anomaly detection.
* **Role-Based Command Scopes**: Tailored dashboards for SCRB Admins, District Officers, and Station Officers.

---

## 🏗️ Architecture & Data Flow

The platform is built on a serverless microservices architecture powered by **Zoho Catalyst**. Below is the comprehensive end-to-end data flow from FIR registration to real-time command dashboards and automated notifications:

```mermaid
flowchart TB
    %% Styling Definitions
    classDef input fill:#0f172a,stroke:#38bdf8,stroke-width:2px,color:#fff;
    classDef gateway fill:#1e1b4b,stroke:#818cf8,stroke-width:2px,color:#fff;
    classDef storage fill:#1e293b,stroke:#64748b,stroke-width:2px,color:#fff;
    classDef circuits fill:#3b0764,stroke:#c084fc,stroke-width:2px,color:#fff;
    classDef ml fill:#450a0a,stroke:#f87171,stroke-width:2px,color:#fff;
    classDef output fill:#022c22,stroke:#34d399,stroke-width:2px,color:#fff;
    classDef ui fill:#1c1917,stroke:#facc15,stroke-width:2px,color:#fff;

    %% Data Input Layer
    subgraph input_layer["📝 Data Input Layer"]
        OFFICER["👮‍♂️ Station Officer (React UI)"]
        IMPORT["📥 Batch Ingestion / Data Generator"]
    end
    class OFFICER,IMPORT input;

    %% API Gateway Layer
    subgraph api_layer["🌐 API Gateway (Catalyst API Gateway)"]
        GW["⚡ API Router / Throttling"]
        AUTH["🔐 RBAC Middleware (Catalyst Auth)"]
    end
    class GW,AUTH gateway;

    %% Storage Layer
    subgraph storage_layer["💾 Data Storage Layer"]
        DS[(🗄️ Catalyst Data Store<br/>28 Relational Tables)]
        CACHE[(⚡ Catalyst Cache<br/>Redis Prediction Cache)]
        STRATUS[(🪣 Catalyst Stratus<br/>S3 Object Bucket)]
    end
    class DS,CACHE,STRATUS storage;

    %% Event & Orchestration Layer
    subgraph event_layer["⚡ Event & Orchestration"]
        SIG["📡 Catalyst Signals<br/>On New Case Insertion"]
        CIRCUITS["🔄 Catalyst Circuits<br/>Workflow Execution"]
        CRON["⏰ Catalyst Cron<br/>Daily 2:00 AM Trigger"]
    end
    class SIG,CIRCUITS,CRON circuits;

    %% AI/ML Inference Layer
    subgraph ml_layer["🧠 AI/ML Inference Layer"]
        ZIA["🤖 Catalyst Zia Services<br/>• NLP MO Extraction<br/>• Voice Speech-to-Text"]
        QML["📊 Catalyst QuickML<br/>• Tabular AutoML<br/>• Time-Series Forecasting"]
        PY["🐍 Python ML Pipelines<br/>• XGBoost Hotspots<br/>• Isolation Forest Anomalies<br/>• Random Forest Outcomes"]
    end
    class ZIA,QML,PY ml;

    %% Output & Action Layer
    subgraph output_layer["📢 Output & Notification Layer"]
        BROWZ["📄 Catalyst SmartBrowz<br/>PDF Exporter"]
        MAIL["📧 Catalyst Mail<br/>SMTP Alerts"]
        PUSH["🔔 Push Notifications"]
    end
    class BROWZ,MAIL,PUSH output;

    %% Dashboard Presentation Layer
    subgraph ui_layer["🖥️ Command Center Dashboard (React SPA)"]
        DASH["📊 Live Dashboard Widgets"]
        MAP["🗺️ Hotspot Map<br/>(Leaflet.js)"]
        NET["🔗 Network Graph<br/>(Cytoscape.js)"]
        SOCIO["🏘️ Socio-Economic Overlay"]
        VOICE["🎤 Voice Command Search"]
    end
    class DASH,MAP,NET,SOCIO,VOICE ui;

    %% Connections
    OFFICER --> GW
    IMPORT --> GW
    GW --> AUTH
    AUTH --> DS
    DS --> SIG
    SIG --> CIRCUITS
    CRON --> CIRCUITS
    CIRCUITS --> ZIA
    CIRCUITS --> QML
    QML --> PY
    PY --> CACHE
    PY --> STRATUS
    PY --> BROWZ
    PY --> MAIL
    PY --> PUSH
    
    DS --> DASH
    CACHE --> DASH
    STRATUS --> BROWZ
    BROWZ --> DASH
    MAIL --> DASH
    PUSH --> DASH
    
    DASH --> MAP
    DASH --> NET
    DASH --> SOCIO
    DASH --> VOICE
```

---

## ✨ Key Features

### 📊 1. Advanced Geospatial Visualization
* **District-Level Drill-down**: Interactive mapping in [HotspotMap.jsx](file:///c:/Users/himan/Desktop/Crime-Intelligence-Agent/client/src/components/Dashboard/HotspotMap.jsx) displaying crime patterns per district and local police station. Zooms dynamically to jurisdictions according to the user's role.
* **Spatiotemporal Clusters**: Timeline playback controls to track how hotspots (Nov 2025 – Jul 2026) move geographically across times of day and months.
* **Emerging Trend Alerts**: Pulsing visual indicators (red-zone pulsing) highlighting districts experiencing sudden crime volume spikes.

### 🔗 2. Criminological Network & Link Analysis
* **Relationship Mapping**: Force-directed node-link graph in [NetworkGraph.jsx](file:///c:/Users/himan/Desktop/Crime-Intelligence-Agent/client/src/components/Dashboard/NetworkGraph.jsx) showing connections between suspects (`offenders`), victims, crime incidents, phone numbers, and bank accounts.
* **Repeat Offender Profiles**: Tracks offender timelines, risk categories, and specific Modus Operandi (MO) in [RiskProfiling.jsx](file:///c:/Users/himan/Desktop/Crime-Intelligence-Agent/client/src/components/Dashboard/RiskProfiling.jsx).
* **Association Detection**: Uses CoQL self-joins in [network/index.js](file:///c:/Users/himan/Desktop/Crime-Intelligence-Agent/functions/network/index.js) to flag shared cases, bank transfers, or communications to expose hidden organized syndicates.

### 🧠 3. Sociological & AI-Driven Predictive Dashboards
* **Socio-Economic Correlation**: Overlays crime statistics with district-level socio-economic indicators (literacy rates, poverty indices, density, income) in [SocioEconomicOverlay.jsx](file:///c:/Users/himan/Desktop/Crime-Intelligence-Agent/client/src/components/Dashboard/SocioEconomicOverlay.jsx).
* **Predictive Risk Scoring**: Forecasts 12-week district crime trends via linear and time-series pipelines in [TrendForecasts.jsx](file:///c:/Users/himan/Desktop/Crime-Intelligence-Agent/client/src/components/Dashboard/TrendForecasts.jsx).
* **Anomaly Detection**: Flags spatial, temporal, and behavioral anomalies via Isolation Forests, surfaced in the [AlertCenter.jsx](file:///c:/Users/himan/Desktop/Crime-Intelligence-Agent/client/src/components/Dashboard/AlertCenter.jsx).

---

## ⚡ Zoho Catalyst Ecosystem Integration
The solution uses Catalyst services natively to implement all key capabilities:

* **Catalyst Serverless Functions**: Backs our REST APIs, ML batch updates, auth middleware, and search engines.
* **Catalyst Web Client Hosting**: Hosts the React SPA production build.
* **Catalyst Data Store**: Manages 28 relational tables matching the KSP schema.
* **Catalyst Cache**: Caches daily ML forecasts and predictions for <200ms load times.
* **Catalyst QuickML**: Manages AutoML tabular and time-series forecasting pipelines.
* **Catalyst Zia Services**: Powers natural language processing for MO parsing and voice search Speech-to-Text.
* **Catalyst SmartBrowz**: Automatically generates PDF intelligence reports.
* **Catalyst Circuits**: Orchestrates multi-step inference and data enrichment pipelines.
* **Catalyst Cron**: Orchestrates daily 2:00 AM runs for python model retraining.
* **Catalyst Mail / Push**: Sends instant alerts to superintendents and toast alerts to operators.
* **Catalyst Pipelines**: Standardizes build and deployment routines.

*See the full compliance checklist: [docs/DATASET_Catalyst_by_Zoho_Supported_Features_Services.md](./docs/DATASET_Catalyst_by_Zoho_Supported_Features_Services.md)*

---

## 📂 Documentation & Reference Datasets

* 🗄️ **[Database Architecture Design](./docs/database_design_document.md)** — Relational structure and derived indexing.
* 🗺️ **[ER Diagram & Schema Dataset](./docs/DATASET_Entity_Relationship_Diagram_Database_Design_Document.md)** — Detailed column definitions and descriptions.
* 📜 **[SQL DDL Schema Script](./docs/schema.sql)** — Raw sql scripts to deploy the 26 KSP tables.
* 🤖 **[ML Integration Architecture](./docs/ML_INTEGRATION.md)** — Retraining cron and predictions API details.
* 🎨 **[Design System Specifications](./DESIGN_SYSTEM.md)** — WCAG 2.1 AAA accessibility palette (navy/gold) and components.

---

## 💻 Getting Started

### Prerequisites
* **Node.js** (v18+)
* **Python** (3.13+)
* **Zoho Catalyst CLI** (`npm install -g zcatalyst-cli`)

### Quick Start (Local Development)

**1. Clone the repository**
```bash
git clone https://github.com/Team-Infinite-Parallax/Crime-Intelligence-Agent.git
cd Crime-Intelligence-Agent
```

**2. Setup API Services Functions**
```bash
cd functions/api_service
npm install
```

**3. Setup Python ML Environment**
```bash
cd ../../ml
python -m venv venv
# Windows: venv\Scripts\activate
# Mac/Linux: source venv/bin/activate
pip install -r requirements.txt
```

**4. Start the Application**
```bash
cd ../
npm install
npm run dev
```
*Frontend running on `http://localhost:5173` and backend API services running on `http://localhost:3001`.*

**5. Setup Database (Catalyst DataStore)**

The complete FIR database implementation (26 tables, 50,000 records) is ready to deploy:

```bash
# One-command setup (production - 50,000 records)
node database/setup-database.js

# Quick test setup (1,000 records)
node database/setup-database.js --test-only
```

This will:
- ✅ Generate synthetic FIR data (50,000 cases from 2023-2026)
- ✅ Import to Catalyst DataStore with full referential integrity
- ✅ Verify database and provide summary statistics

**📖 Database Documentation:**
- [Quick Start Guide](./database/QUICK_START.md) — Get database running in 10 minutes
- [Deployment Guide](./docs/DATABASE_DEPLOYMENT_GUIDE.md) — Complete step-by-step walkthrough
- [Implementation Summary](./docs/DATABASE_IMPLEMENTATION_SUMMARY.md) — What was built and how to use it
- [Database API Reference](./database/README.md) — Query functions and usage examples

**Note:** Backend Catalyst functions are already integrated with the database. Frontend updates to use real APIs are documented in the deployment guide.

---

## 🔑 Demo Access Credentials

The command center uses Role-Based Access Control. Test with these configurations:

| Role | Officer Name | Login ID | Passcode | Access Level |
| :--- | :--- | :--- | :--- | :--- |
| 🛡️ **SCRB Admin (HQ)** | Prashant Kumar | `KSP-SCRB-100` | `Ansh@123` | State-wide analytics, ML retrain parameters, complete logs. |
| 📍 **District Officer** | Praveen Verma | `KSP-DIST-009` | `009` | District-scoped hotspots, anomaly alerts, local deployment. |
| 🚓 **Station Officer** | Mohammed Puttaiah | `KSP-UNIT-001` | `001` | Station-scoped cases, log registration, local offender tracking. |

---

## 🗺️ Project Structure

```
├── client/                  # React frontend
│   ├── src/
│   │   ├── components/      # Dashboard widgets, Layouts
│   │   ├── contexts/        # Filter state management
│   │   ├── data/            # Static data & network graph data
│   │   └── utils/           # Helpers & CoP bot integration
├── functions/               # Zoho Catalyst serverless functions
│   ├── api_service/         # REST API (Node.js/Express)
│   ├── predictions/         # ML prediction handler
│   └── ml-batch-update/     # Batch ML update function
├── ml/                      # Python ML scripts
│   ├── models.py            # Model definitions
│   ├── feature_engineering.py
│   ├── quickml_integration.py
│   └── tests/               # ML test suite
├── docs/                    # Documentation
├── scripts/                 # Utility scripts
├── tests/                   # Integration/E2E tests
├── data-generator/          # Synthetic data generation
├── DESIGN_SYSTEM.md         # Design system & visual spec
├── PROBLEM_STATEMENT.md     # Problem & scope definition
└── graphify-out/            # Knowledge graph (architecture)
```

---

## 🚀 Roadmap

- **CCTV Integration** — Real-time facial recognition and vehicle plate tracking
- **NLP on FIR Narratives** — Automated MO extraction and suspect description parsing using LLMs
- **Social Media Sentiment** — Public sentiment monitoring as a leading indicator for unrest
- **Graph Knowledge Base** — Persistent queryable knowledge graph of the codebase via [graphify](https://github.com/anomalyco/graphify)

---

## Quality Mandate

This project targets **100/100** across Code Quality, Security, Efficiency, Testing, Accessibility, and Problem Statement Alignment. See [`PROBLEM_STATEMENT.md`](./PROBLEM_STATEMENT.md#quality-mandate) for details.

---

<div align="center">
  <b>Built for the Karnataka State Police</b><br>
  <i>Empowering Law Enforcement with Zoho Catalyst & Data-Driven Intelligence</i>
</div>
