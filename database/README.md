# Karnataka Police FIR Database Implementation

This directory contains the complete database implementation for the Crime Intelligence & Analytical Platform based on the **Karnataka Police FIR Entity-Relationship Diagram** from the official dataset.

## 📁 Directory Structure

```
database/
├── README.md                      # This file
├── create-catalyst-tables.js      # Table schema definitions (all 26 tables)
├── db-utils.js                    # Query utility functions
├── catalyst-tables.json           # JSON schema reference
└── setup-guide.md                 # Step-by-step deployment guide
```

## 🗄️ Database Architecture

### Platform: Zoho Catalyst DataStore

The database is implemented on **Zoho Catalyst DataStore**, a serverless NoSQL database with SQL-like query capabilities via CoQL (Catalyst Query Language).

### Schema Overview

**26 Tables** organized in a star schema pattern:

#### Reference/Dimension Tables (19 tables)
1. **State** - State master data
2. **District** - District administrative boundaries
3. **UnitType** - Police unit categories
4. **Unit** - Police stations and units
5. **Rank** - Police rank hierarchy
6. **Designation** - Functional roles
7. **Employee** - Police personnel roster
8. **CaseCategory** - FIR/UDR/PAR/Zero FIR categories
9. **GravityOffence** - Heinous/Non-Heinous classification
10. **CrimeHead** - Major crime categories
11. **CrimeSubHead** - Crime subcategories
12. **CaseStatusMaster** - Case status lookup
13. **Court** - Court information
14. **OccupationMaster** - Occupation lookup
15. **ReligionMaster** - Religion lookup
16. **CasteMaster** - Caste lookup
17. **Act** - Legal acts (IPC, NDPS, IT Act, etc.)
18. **Section** - Act sections (302, 307, etc.)
19. **CrimeHeadActSection** - Maps crime heads to act sections

#### Fact/Transaction Tables (7 tables)
20. **CaseMaster** ⭐ - Core FIR/case table (star schema center)
21. **ComplainantDetails** - Complainant information
22. **ActSectionAssociation** - Links cases to legal acts/sections
23. **Victim** - Victim information
24. **Accused** - Accused person information
25. **ArrestSurrender** - Arrest and surrender events
26. **ChargesheetDetails** - Chargesheet information

### Entity Relationships

```
                    ┌─────────────┐
                    │  CaseMaster │ ⭐ STAR SCHEMA CENTER
                    └──────┬──────┘
                           │
         ┌─────────────────┼─────────────────┐
         │                 │                 │
    ┌────▼────┐      ┌────▼────┐      ┌────▼────┐
    │ Accused │      │ Victim  │      │Complain-│
    └────┬────┘      └─────────┘      │  ant    │
         │                             └─────────┘
    ┌────▼─────────┐
    │ArrestSurrender│
    └──────────────┘

CaseMaster connects to:
  - Unit (PoliceStationID) → District → State
  - Employee (PolicePersonID)
  - CrimeHead, CrimeSubHead
  - Court
  - CaseCategory, GravityOffence, CaseStatusMaster
```

## 🚀 Quick Start

### Prerequisites

1. **Zoho Catalyst Project** initialized
2. **Node.js** v14+ installed
3. **Python 3.8+** (for data generator)
4. **zcatalyst-sdk-node** package installed

```bash
npm install zcatalyst-sdk-node
```

### Environment Variables

Create a `.env` file in the project root:

```env
CATALYST_PROJECT_ID=your_project_id
CATALYST_PROJECT_KEY=your_project_key
CATALYST_ENVIRONMENT=development
```

### Step 1: Create Tables in Catalyst DataStore

Tables must be created via the Catalyst Console or CLI:

1. Log in to [Zoho Catalyst Console](https://console.catalyst.zoho.com)
2. Navigate to **Data Store** → **Tables**
3. Create tables using the schema in `create-catalyst-tables.js`

**OR** use the Catalyst CLI:

```bash
catalyst tables:create --from-schema database/create-catalyst-tables.js
```

### Step 2: Generate Synthetic Data

The data generator creates 50,000 synthetic FIR records:

```bash
cd data-generator
pip install faker pandas numpy
python generate.py
```

Output: 26 CSV files in `data-generator/output/`

### Step 3: Import Data to Catalyst

```bash
cd data-generator
node import-data.js
```

This imports all CSV files into Catalyst DataStore with:
- ✅ FK integrity checks
- ✅ Duplicate detection
- ✅ Batch processing (500 rows/batch)
- ✅ Automatic retry with exponential backoff

### Step 4: Verify Database

Query the database to verify data:

```javascript
const { initCatalyst, queryCases } = require('./database/db-utils');

const app = initCatalyst();
const cases = await queryCases(app, { limit: 10 });
console.log(`Total cases: ${cases.length}`);
```

## 📊 Using the Database

### In Catalyst Functions

```javascript
const { 
  queryCases, 
  getHotspots, 
  getDistrictStats 
} = require('../database/db-utils');

module.exports = async (req, res) => {
  const app = req.catalyst;
  
  // Query cases with filters
  const cases = await queryCases(app, {
    district: 1,
    dateFrom: '2023-01-01',
    dateTo: '2023-12-31',
    limit: 1000
  });
  
  res.status(200).json({ 
    success: true, 
    data: cases 
  });
};
```

### Available Query Functions

All functions are in [`db-utils.js`](./db-utils.js):

| Function | Purpose |
|----------|---------|
| `queryCases(app, filters)` | Query cases with district, date, crime type filters |
| `getHotspots(app, params)` | Get crime hotspots with spatial clustering |
| `getDistrictStats(app, districtId)` | Get district-level crime statistics |
| `getCrimeTrends(app, params)` | Get time-series crime trends |
| `getNetworkData(app, params)` | Get accused-victim network relationships |
| `getRepeatOffenders(app, minCases)` | Identify repeat offenders |
| `getCaseDetails(app, identifier)` | Get complete case details by CrimeNo or ID |
| `getCrimeTypeDistribution(app, filters)` | Get crime type distribution |

### Example: Get Crime Hotspots

```javascript
const hotspots = await getHotspots(app, {
  districtId: 1,
  dateFrom: '2025-01-01',
  dateTo: '2025-12-31'
});

// Returns:
// [
//   {
//     latitude: 12.9716,
//     longitude: 77.5946,
//     crime_count: 45,
//     CrimeMajorHeadID: 2
//   },
//   ...
// ]
```

## 🔧 Database Maintenance

### Updating Schema

If you need to modify the schema:

1. Update `create-catalyst-tables.js`
2. Modify tables via Catalyst Console
3. Re-run data import if needed

### Backup

Use Catalyst's built-in backup features:

```bash
catalyst datastore:export --table CaseMaster --output backup/
```

### Performance Optimization

Catalyst DataStore automatically indexes primary keys. For custom queries, consider:

1. **Compound indexes** on frequently queried columns
2. **Materialized views** for complex aggregations
3. **Caching** frequently accessed data

## 📖 Documentation References

- [Database Design Document](../docs/database_design_document.md)
- [ER Diagram Dataset](../docs/DATASET_Entity_Relationship_Diagram_Database_Design_Document.md)
- [SQL Schema](../docs/schema.sql)
- [Zoho Catalyst DataStore Docs](https://docs.catalyst.zoho.com/en/datastore/)

## 🐛 Troubleshooting

### Issue: "Table does not exist"
**Solution:** Create tables via Catalyst Console first before importing data.

### Issue: "Foreign key constraint failed"
**Solution:** Import tables in the correct order (see `import_order.txt`).

### Issue: "Duplicate key error"
**Solution:** The import script automatically skips duplicates. Clean data if needed.

### Issue: "Query timeout"
**Solution:** Add indexes, reduce result set size, or use pagination.

## 📝 Notes

- **CrimeNo Format**: `{CategoryCode}{DistrictID}{UnitID}{Year}{SerialNo}`
  - Example FIR: `104430006202600001`
  - Example UDR: `304430006202600001`
  
- **Date Fields**: Use ISO 8601 format (`YYYY-MM-DD` or `YYYY-MM-DD HH:mm:ss`)

- **Geospatial Data**: All coordinates are in WGS84 (latitude, longitude)

- **Case Status Codes**:
  - 1 = Under Investigation
  - 2 = Charge Sheeted
  - 3 = Closed
  - 4 = Undetected

## 🔐 Security

- ✅ All database queries use parameterized CoQL
- ✅ Role-based access control (RBAC) via Catalyst
- ✅ Sensitive fields (KGID, personal info) require admin privileges
- ✅ Audit logs enabled for all write operations

## 📞 Support

For issues or questions:
1. Check the [troubleshooting section](#-troubleshooting)
2. Review [Catalyst DataStore documentation](https://docs.catalyst.zoho.com/en/datastore/)
3. Contact the development team

---

**Last Updated**: 2026-07-15  
**Database Version**: 1.0  
**Schema Revision**: Based on Official KSP FIR ER Diagram
