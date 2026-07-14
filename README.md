<div align="center">
  
  <h1>🚨 Crime Intelligence Agent (CIA) 🚨</h1>
  <p><strong>Next-Generation Predictive Policing and Real-Time Crime Analytics powered by Zoho Catalyst</strong></p>
  
  <p>
    <a href="#-the-problem">Problem</a> •
    <a href="#-the-solution">Solution</a> •
    <a href="#-features">Features</a> •
    <a href="#-tech-stack">Tech Stack</a> •
    <a href="#-architecture">Architecture</a> •
    <a href="#-installation">Installation</a>
  </p>
</div>

---

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg?style=flat-square)]()
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![Zoho Catalyst](https://img.shields.io/badge/Powered_by-Zoho_Catalyst-orange.svg?style=flat-square)]()
[![React](https://img.shields.io/badge/Frontend-React_18-61DAFB.svg?style=flat-square&logo=react)]()
[![Node.js](https://img.shields.io/badge/Backend-Node.js_18.x-339933.svg?style=flat-square&logo=node.js)]()
[![Python ML](https://img.shields.io/badge/ML-Python_3.13-3776AB.svg?style=flat-square&logo=python)]()

An AI-powered **Crime Intelligence Agent** designed specifically for the **Karnataka State Police**. The platform leverages the **Zoho Catalyst** serverless ecosystem to process First Information Reports (FIRs) in real-time, generate automated intelligence on crime hotspots, and proactively send alerts to commanding officers. By transforming raw text into predictive intelligence, this tool significantly improves response times and law enforcement strategy.

---

## 🚨 The Problem

Law enforcement agencies collect vast amounts of data through FIRs, but traditional methods of analysis are **reactive** and **manual**. 
- 📉 **Siloed Data:** Hard to detect emerging patterns across different jurisdictions.
- 🕒 **Delayed Responses:** Manual intelligence reporting takes days, leading to missed opportunities for crime prevention.
- 📍 **Inefficient Resource Allocation:** Without real-time hotspot tracking, patrol dispatching relies on intuition rather than data.

## 💡 The Solution

**Crime Intelligence Agent (CIA)** shifts the paradigm from reactive policing to **proactive, predictive enforcement**. 
By utilizing Zoho's robust serverless architecture and QuickML, our platform instantly processes incoming FIRs, identifies geographic anomalies, forecasts future crime volumes, and generates automated, actionable intelligence reports for stakeholders at every level (State, District, and Station).

---

## ✨ Key Features

- ⚡ **Real-Time FIR Processing**: Instant ingestion, parsing, and structuring of textual FIR data using Catalyst Advanced I/O.
- 🔮 **Predictive Policing (AI/ML)**: Time-series forecasting to predict future crime volumes by district using Catalyst QuickML.
- 🚨 **Automated Anomaly Detection**: Proactive identification of irregular crime spikes in specific jurisdictions.
- 🗺️ **Geospatial Hotspot Mapping**: Interactive, animated crime density and hotspot maps (built with React Leaflet) for instant situational awareness.
- 📄 **Automated Intelligence Reports**: Dynamic PDF reports generated from ML insights using Catalyst SmartBrowz.
- 🔔 **Instant Escalations & Alerts**: Automated Email/SMS alerts triggered by Event Signals and sent to jurisdictional officers when severe anomalies are detected.
- 🛡️ **Role-Based Access Control (RBAC)**: Tailored dashboards for State Admins, District Officers, and Investigating Officers.

---

## 🛠️ Tech Stack

### ☁️ Zoho Catalyst Ecosystem (Core Infrastructure)
- **Catalyst Datastore**: Relational database for FIRs, Districts, Stations, and ML Predictions.
- **Catalyst Advanced I/O**: Node.js/Express backend powering the REST API.
- **Catalyst Event Signals**: Asynchronous triggers that fire upon new FIR insertions.
- **Catalyst Circuits**: Workflow orchestration for the multi-step AI inference pipeline.
- **Catalyst QuickML**: Machine learning model training and deployment for forecasting.
- **Catalyst SmartBrowz**: Dynamic PDF Intelligence Report generation.
- **Catalyst Mail/Cron**: Scheduled and event-driven alert notifications.

### 💻 Application Layer
- **Frontend**: React.js 18, TailwindCSS, React Leaflet (Maps), Recharts (Data Visualization).
- **Backend API**: Node.js, Express.js.
- **Data Science / ML**: Python 3.13, Scikit-Learn, Pandas (for local feature engineering).

---

## 🏗️ Architecture & Workflow

The system follows a highly scalable, serverless microservices architecture:

1. **FIR Ingestion**: An officer submits an FIR via the React Dashboard. The REST API saves it to the Catalyst Datastore.
2. **Event Trigger**: A Catalyst Event Signal is fired upon database insertion.
3. **Orchestration**: Catalyst Circuits manage the intelligence pipeline.
4. **AI Inference**: The FIR data is processed. Catalyst QuickML evaluates historical context and determines if an anomaly exists.
5. **Action**: 
   - If an anomaly is detected, Catalyst Mail sends an instant alert to the District Officer.
   - Hotspot Maps on the dashboard are updated via WebSocket/Polling.
   - SmartBrowz generates a new Intelligence PDF.

---

## 📸 Sneak Peek (Dashboard & Analytics)

<div align="center">
  <table width="100%">
    <tr>
      <td width="50%" align="center"><b>Dashboard Overview & Metrics</b></td>
      <td width="50%" align="center"><b>Geospatial Crime Hotspots</b></td>
    </tr>
    <tr>
      <td><img src="https://via.placeholder.com/600x350/1e293b/ffffff?text=Interactive+Dashboard+UI" alt="Dashboard Overview"></td>
      <td><img src="https://via.placeholder.com/600x350/1e293b/ffffff?text=Geospatial+Heatmap" alt="Hotspot Map"></td>
    </tr>
    <tr>
      <td width="50%" align="center"><b>Predictive Trend Analysis</b></td>
      <td width="50%" align="center"><b>Automated PDF Reporting (SmartBrowz)</b></td>
    </tr>
    <tr>
      <td><img src="https://via.placeholder.com/600x350/1e293b/ffffff?text=AI+Crime+Forecasting" alt="AI Trends"></td>
      <td><img src="https://via.placeholder.com/600x350/1e293b/ffffff?text=Intelligence+Report" alt="PDF Report"></td>
    </tr>
  </table>
</div>

---

## 💻 Local Installation & Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [Python](https://www.python.org/) (3.13+)
- [Zoho Catalyst CLI](https://catalyst.zoho.com/help/cli.html) (`npm install -g zcatalyst-cli`)
- A Zoho Catalyst Account

### Quick Start

**1. Clone the Repository**
```bash
git clone https://github.com/Team-Infinite-Parallax/Crime-Intelligence-Agent.git
cd Crime-Intelligence-Agent
```

**2. Setup Backend (Catalyst Functions)**
```bash
cd functions/api_service
npm install
```

**3. Setup Frontend (React Client)**
```bash
cd ../../client
npm install
npm run dev
```

**4. Setup Python ML Environment (Optional, for synthetic data & tuning)**
```bash
cd ../
python -m venv .venv
# Activate virtual env:
# Windows: .venv\Scripts\activate
# Mac/Linux: source .venv/bin/activate
pip install -r requirements.txt
```

---

## ☁️ Zoho Catalyst Deployment

Deploying the application to production is fully automated via the CLI:

```bash
# 1. Login to your Catalyst account
catalyst login

# 2. Initialize the project context
catalyst init

# 3. Deploy Client, Functions, and Schema
catalyst deploy
```

---

## 🔑 Demo Access Credentials

The portal features comprehensive role-based access control. Test the system using these pre-configured accounts:

| Role | Officer Name | Login ID | Passcode | Access Level |
| :--- | :--- | :--- | :--- | :--- |
| 🛡️ **SCRB Admin (HQ)** | Prashant Kumar | `KSP-SCRB-100` | `100` | State-wide analytics, ML config, System overview |
| 📍 **District Officer** | Praveen Verma | `KSP-DIST-009` | `009` | District-level hotspots, Anomaly alerts, Resource planning |
| 🚓 **Station Officer** | Mohammed Puttaiah | `KSP-UNIT-001` | `001` | Station-level FIR logging, Local case management |

---

## 🚀 What's Next? (Roadmap)

- **CCTV Integration**: Real-time facial recognition and vehicle plate tracking linked directly to the intelligence pipeline.
- **NLP on FIR Narratives**: Extracting MO (Modus Operandi) and suspect descriptions automatically using LLMs.
- **Social Media Sentiment**: Monitoring public sentiment as a leading indicator for potential riots or unrest.

---

<div align="center">
  <b>Built with ❤️ for the Hackathon</b><br>
  <i>Empowering Law Enforcement with Data-Driven Intelligence</i>
</div>
