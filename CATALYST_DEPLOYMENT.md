# Catalyst Deployment Guide - Crime Intelligence Agent

**Complete step-by-step guide to deploy the KSP Crime Intelligence Agent to Catalyst by Zoho**

---

## 📋 Prerequisites Checklist

Before starting deployment:

- [x] Catalyst CLI installed (v1.26.2 detected)
- [ ] Zoho account with Catalyst access
- [ ] Database implementation complete (✅ already done)
- [ ] Frontend API integration ready (✅ already done)
- [ ] Node.js 14+ and Python 3.8+ installed

---

## 🚀 Deployment Steps

### Step 1: Authenticate with Catalyst

First, login to your Catalyst account:

```bash
# Login to Catalyst
catalyst login

# This will open a browser window for authentication
# Login with your Zoho credentials
# Grant necessary permissions when prompted
```

**Verify authentication:**
```bash
catalyst account:list
```

You should see your account details listed.

### Step 2: Initialize/Link Catalyst Project

Check if project is already initialized:

```bash
# Check project info
catalyst project:info
```

**If not initialized**, run:

```bash
# Initialize Catalyst project in current directory
catalyst init

# Follow prompts:
# - Select existing project or create new one
# - Choose project name: "ksp-crime-intelligence-agent"
# - Select region (choose closest to Karnataka, India)
# - Choose stack: Node.js
```

**If already initialized**, verify `catalyst.json` is correct (✅ already configured).

### Step 3: Install Function Dependencies

Install dependencies for all functions:

```bash
# Install dependencies for each function
cd functions/dashboard && npm install && cd ../..
cd functions/hotspots && npm install && cd ../..
cd functions/crimelist && npm install && cd ../..
cd functions/network && npm install && cd ../..
cd functions/predictions && npm install && cd ../..
cd functions/alerts && npm install && cd ../..
cd functions/clustering && npm install && cd ../..
cd functions/risk && npm install && cd ../..
cd functions/auth && npm install && cd ../..
cd functions/voice_ai && npm install && cd ../..
cd functions/ai-agent && npm install && cd ../..
cd functions/datathon_function && npm install && cd ../..
```

**Or use this one-liner:**
```bash
for dir in functions/*/; do (cd "$dir" && npm install); done
```

### Step 4: Create Database Tables in Catalyst DataStore

You need to manually create the 26 tables in Catalyst Console first.

**Option A: Via Catalyst Console (Recommended for first-time)**

1. Open Catalyst Console: https://console.catalyst.zoho.com
2. Select your project
3. Navigate to **Data Store** → **Tables**
4. Click **Create Table**

For each of the 26 tables, use the schema from [`database/create-catalyst-tables.js`](database/create-catalyst-tables.js):

**Create tables in this order (to satisfy foreign key dependencies):**

**Phase 1 - Master Tables (no dependencies):**
1. State
2. District  
3. UnitType
4. Rank
5. Designation
6. CaseCategory
7. GravityOffence
8. CaseStatusMaster
9. OccupationMaster
10. ReligionMaster
11. CasteMaster
12. Act

**Phase 2 - Dependent Master Tables:**
13. Unit (requires: District, UnitType, State)
14. Employee (requires: District, Unit, Rank, Designation)
15. Court (requires: District, State)
16. CrimeHead
17. CrimeSubHead (requires: CrimeHead)
18. Section (requires: Act)
19. CrimeHeadActSection (requires: CrimeHead, Act, Section)

**Phase 3 - Transaction Tables:**
20. CaseMaster (requires: Employee, Unit, CaseCategory, GravityOffence, CrimeHead, CrimeSubHead, CaseStatusMaster, Court)
21. ComplainantDetails (requires: CaseMaster, OccupationMaster, ReligionMaster, CasteMaster)
22. ActSectionAssociation (requires: CaseMaster, Act, Section)
23. Victim (requires: CaseMaster)
24. Accused (requires: CaseMaster)
25. ArrestSurrender (requires: CaseMaster, State, District, Unit, Employee, Court, Accused)
26. ChargesheetDetails (requires: CaseMaster, Employee)

**Column Type Mapping (Catalyst DataStore):**
- `bigint` → Number (integer)
- `varchar(N)` → Text (max length N)
- `text` → Text (no limit)
- `date` → Date
- `datetime` → DateTime  
- `double` → Decimal
- `boolean` → Boolean

**Important**: Mark primary key columns as "Mandatory" and "Unique" in Catalyst Console.

### Step 5: Import Database Data

After tables are created, import the generated data:

```bash
# Set Catalyst credentials as environment variables
export CATALYST_PROJECT_ID="your_project_id"
export CATALYST_PROJECT_KEY="your_project_key"
export CATALYST_ENVIRONMENT="development"

# Generate synthetic FIR data (50,000 records)
cd data-generator
pip install faker pandas numpy
python generate.py

# Import to Catalyst DataStore
node import-data.js
```

This will take 20-30 minutes for 50,000 records.

**For testing, use smaller dataset:**
```bash
# Generate only 1,000 test records
python generate.py --test
node import-data.js
```

**Verify import:**
```bash
# Run verification
cd ..
node database/setup-database.js --step=4
```

### Step 6: Deploy Catalyst Functions

Deploy all serverless functions to Catalyst:

```bash
# Deploy all functions at once
catalyst deploy --functions

# Or deploy specific functions individually:
catalyst deploy --function dashboard
catalyst deploy --function hotspots
catalyst deploy --function crimelist
catalyst deploy --function network
catalyst deploy --function predictions
catalyst deploy --function alerts
catalyst deploy --function clustering
catalyst deploy --function risk
catalyst deploy --function auth
catalyst deploy --function voice_ai
catalyst deploy --function ai-agent
catalyst deploy --function datathon_function
```

**Expected output:**
```
✓ Functions deployed successfully
  - dashboard: https://your-project.catalyst.zohoapis.com/server/dashboard_function
  - hotspots: https://your-project.catalyst.zohoapis.com/server/hotspots_function
  ...
```

**Test functions:**
```bash
# Test dashboard function
curl https://your-project.catalyst.zohoapis.com/server/dashboard_function

# Should return JSON with stats
```

### Step 7: Build and Deploy Frontend

Build the React frontend and deploy to Catalyst:

```bash
# Install frontend dependencies
cd client
npm install

# Create production environment file
cat > .env.production << EOF
VITE_API_URL=https://your-project-id.catalyst.zohoapis.com
EOF

# Build frontend for production
npm run build

# Verify build output
ls -la dist/
```

**Deploy to Catalyst:**

```bash
# Return to project root
cd ..

# Deploy client (frontend)
catalyst deploy --client
```

**Alternative: Deploy to Catalyst Slate**

If using Catalyst Slate for frontend hosting:

1. Go to Catalyst Console → **Slate**
2. Click **Deploy**
3. Upload the `client/dist` folder contents
4. Configure domain (optional)

### Step 8: Configure Environment Variables

Set environment variables in Catalyst Console:

1. Open Catalyst Console
2. Go to **Settings** → **Environment Variables**
3. Add these variables:

```
CATALYST_PROJECT_ID=<your_project_id>
CATALYST_PROJECT_KEY=<your_project_key>
DATABASE_VERSION=1.0
NODE_ENV=production
```

### Step 9: Configure CORS

Enable CORS for frontend-backend communication:

1. Go to Catalyst Console → **Functions**
2. For each function, click **Settings** → **CORS**
3. Add your frontend domain:
   - Development: `http://localhost:5173`
   - Production: `https://your-frontend-domain.com`
4. Save changes

### Step 10: Test Deployment

**Test backend functions:**
```bash
# Test dashboard
curl https://your-project.catalyst.zohoapis.com/server/dashboard_function

# Test hotspots
curl "https://your-project.catalyst.zohoapis.com/server/hotspots_function?limit=10"

# Test with authentication
curl -H "x-employee-role: SCRB_ADMIN" \
     -H "x-employee-email: admin@ksp.in" \
     https://your-project.catalyst.zohoapis.com/server/dashboard_function
```

**Test frontend:**
1. Open deployed frontend URL
2. Login with credentials from README:
   - SCRB Admin: `KSP-SCRB-100` / `Ansh@123`
3. Verify dashboard loads with real data
4. Check browser console for any API errors

---

## ⚙️ Configuration Files Reference

Your project already has these configured:

- [`catalyst.json`](catalyst.json) - Main Catalyst config (✅ configured)
- `functions/*/catalyst-config.json` - Individual function configs (✅ all present)
- `client/dist` - Frontend build output directory (✅ configured)

---

## 🐛 Troubleshooting

### Issue: "catalyst: command not found"

**Solution**: Install Catalyst CLI
```bash
npm install -g zcatalyst-cli
```

### Issue: "Authentication failed"

**Solution**: Re-authenticate
```bash
catalyst logout
catalyst login
```

### Issue: "Function deployment failed"

**Solutions**:
1. Check function dependencies: `cd functions/<name> && npm install`
2. Verify catalyst-config.json exists in function directory
3. Check function logs: `catalyst logs --function <name>`

### Issue: "Database import failed"

**Solutions**:
1. Verify tables exist in Catalyst Console → Data Store
2. Check table names match exactly (case-sensitive)
3. Verify foreign key relationships are correct
4. Check import logs for specific errors

### Issue: "Frontend shows 'API failed, using mock data'"

**Solutions**:
1. Verify `VITE_API_URL` is set in `client/.env.production`
2. Check CORS is configured for frontend domain
3. Verify functions are deployed: `catalyst project:info`
4. Check browser console for specific error messages

### Issue: "CORS errors in browser console"

**Solution**: Configure CORS in Catalyst Console → Functions → each function → CORS Settings

---

## 📚 Next Steps After Deployment

1. **Monitor Performance**: Check Catalyst Console → **Monitoring** → **Functions**
2. **Set up Logging**: Enable detailed logging for debugging
3. **Configure Backups**: Set up automated DataStore backups
4. **Add Custom Domain**: Configure custom domain in Catalyst Console → **Domain Mappings**
5. **Enable SSL**: Catalyst provides free SSL certificates
6. **Set up CI/CD**: Use Catalyst Pipelines for automated deployments

---

## 🔗 Useful Links

- Catalyst Console: https://console.catalyst.zoho.com
- Catalyst Documentation: https://docs.catalyst.zoho.com
- Database Setup Guide: [database/QUICK_START.md](database/QUICK_START.md)
- Frontend Integration: [client/FRONTEND_API_INTEGRATION.md](client/FRONTEND_API_INTEGRATION.md)
- Implementation Summary: [docs/DATABASE_IMPLEMENTATION_SUMMARY.md](docs/DATABASE_IMPLEMENTATION_SUMMARY.md)

---

**Deployment Status**: Ready to deploy ✅  
**Estimated Time**: 1-2 hours (depending on data import size)  
**Last Updated**: 2026-07-15
