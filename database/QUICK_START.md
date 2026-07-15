# Database Quick Start Guide

> 🚀 Get the Karnataka Police FIR Database up and running in 10 minutes

---

## 📦 One-Command Setup

```bash
# Full production setup (50,000 records)
node database/setup-database.js

# Quick test setup (1,000 records) 
node database/setup-database.js --test-only
```

That's it! The script will:
1. ✅ Validate prerequisites
2. ✅ Generate synthetic data
3. ✅ Import to Catalyst DataStore
4. ✅ Verify database integrity

---

## ⚙️ Prerequisites (5 minutes)

```bash
# 1. Install Python packages
pip install faker pandas numpy

# 2. Install Node packages
npm install zcatalyst-sdk-node

# 3. Set environment variables
# Create .env file:
CATALYST_PROJECT_ID=your_project_id
CATALYST_PROJECT_KEY=your_project_key
```

Get Catalyst credentials: https://console.catalyst.zoho.com → Settings

---

## 📊 Database Schema

**26 Tables** | **Star Schema** | **300,000+ Records**

```
CaseMaster (⭐ Fact Table)
├── Accused → ArrestSurrender
├── Victim
├── ComplainantDetails
└── ActSectionAssociation

Dimensions:
├── District → State
├── Unit → District, UnitType
├── Employee → Rank, Designation
├── CrimeHead → CrimeSubHead
└── Act → Section
```

---

## 🔍 Quick Queries

### Query Cases
```javascript
const { initCatalyst, queryCases } = require('./database/db-utils');

const app = initCatalyst();
const cases = await queryCases(app, {
  district: 1,
  dateFrom: '2025-01-01',
  dateTo: '2025-12-31',
  limit: 1000
});
```

### Get Hotspots
```javascript
const { getHotspots } = require('./database/db-utils');

const hotspots = await getHotspots(app, {
  districtId: 1,
  dateFrom: '2025-01-01',
  dateTo: '2025-12-31'
});
```

### Get District Stats
```javascript
const { getDistrictStats } = require('./database/db-utils');

const stats = await getDistrictStats(app);
// Returns: [{ DistrictName, total_cases, heinous_cases, closed_cases }]
```

---

## 🔧 Available Functions

All in [`database/db-utils.js`](../database/db-utils.js):

| Function | Purpose |
|----------|---------|
| `queryCases()` | Filter and search cases |
| `getHotspots()` | Spatial crime clustering |
| `getDistrictStats()` | District-level statistics |
| `getCrimeTrends()` | Time-series analysis |
| `getNetworkData()` | Accused-victim relationships |
| `getRepeatOffenders()` | Recidivism detection |
| `getCaseDetails()` | Complete case info |
| `getCrimeTypeDistribution()` | Crime type breakdown |

---

## 🏗️ Manual Setup

If automated setup fails:

```bash
# Step 1: Generate data
cd data-generator
python generate.py

# Step 2: Create tables in Catalyst Console
# Use schemas from database/create-catalyst-tables.js
# https://console.catalyst.zoho.com → Data Store → Tables

# Step 3: Import data
node import-data.js
```

---

## ✅ Verify Installation

```bash
# Run verification
node database/setup-database.js --step=4

# Expected output:
# ✓ Cases: 50000
# ✓ Districts: 31
# ✓ Accused: 75000
# ✓ Victims: 60000
```

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| "Table does not exist" | Create tables via Catalyst Console |
| "Foreign key error" | Check import order (see import_order.txt) |
| "Python not found" | Install Python 3.8+ |
| Import too slow | Use `--test-only` flag |

---

## 📚 Full Documentation

- **Quick Start**: You're reading it! ✓
- **Complete API**: [database/README.md](../database/README.md)
- **Deployment Guide**: [docs/DATABASE_DEPLOYMENT_GUIDE.md](../docs/DATABASE_DEPLOYMENT_GUIDE.md)
- **Implementation Summary**: [docs/DATABASE_IMPLEMENTATION_SUMMARY.md](../docs/DATABASE_IMPLEMENTATION_SUMMARY.md)
- **ER Diagram**: [docs/DATASET_Entity_Relationship_Diagram_Database_Design_Document.md](../docs/DATASET_Entity_Relationship_Diagram_Database_Design_Document.md)

---

## 🎯 Next Steps

After database setup:

1. **Test API endpoints**:
   ```bash
   cd functions/dashboard
   catalyst serve
   curl http://localhost:9000/dashboard
   ```

2. **Update frontend** to use real API (see deployment guide)

3. **Add performance indexes** (see README)

4. **Deploy to production**:
   ```bash
   catalyst deploy
   ```

---

**Questions?** Check [DATABASE_IMPLEMENTATION_SUMMARY.md](../docs/DATABASE_IMPLEMENTATION_SUMMARY.md)

**Database Version**: 1.0 | **Status**: ✅ Ready for Production
