# Frontend API Integration Guide

This guide explains how to integrate the real Catalyst database API with the frontend.

## 🔌 What Was Added

Two new files provide complete API integration with the Catalyst database backend:

1. **`client/src/config/api.js`** - API configuration and endpoints
2. **`client/src/utils/api.js`** - Real API functions with automatic mock fallback

## 🚀 Quick Start

### Option 1: Use Real API (Production)

Set environment variable in `.env`:

```env
# Catalyst API URL (get from Catalyst Console)
VITE_API_URL=https://your-project-id-region.catalyst.zohoapis.com

# Optional: Force mock mode
VITE_USE_MOCK_API=false
```

### Option 2: Use Mock API (Development)

Don't set `VITE_API_URL` - the app will automatically use mock data.

Or explicitly enable mock mode:

```env
VITE_USE_MOCK_API=true
```

## 📝 Usage in Components

Replace mock API imports with real API:

### Before (Mock Data)

```javascript
import { MOCK_OUTCOMES, MOCK_FORECASTS } from '@/utils/mockApi';

// Component uses static mock data
const outcomes = MOCK_OUTCOMES;
```

### After (Real API with Fallback)

```javascript
import { fetchPredictions, fetchForecasts } from '@/utils/api';

// Component fetches from real API or falls back to mock
const { predictions } = await fetchPredictions();
const { forecasts } = await fetchForecasts({ districtId: 1 });
```

## 📦 Available API Functions

All functions in `client/src/utils/api.js`:

| Function | Endpoint | Purpose |
|----------|----------|---------|
| `fetchDashboardStats()` | `/server/dashboard_function` | Dashboard statistics |
| `fetchHotspots(params)` | `/server/hotspots_function` | Crime hotspot locations |
| `fetchCases(filters)` | `/server/crimelist_function` | Case listing with filters |
| `fetchPredictions(params)` | `/server/predictions_function` | ML case outcome predictions |
| `fetchForecasts(params)` | `/server/predictions_function` | Crime trend forecasts |
| `fetchAnomalies(params)` | `/server/predictions_function` | Anomaly detection results |
| `fetchClusters(params)` | `/server/clustering_function` | Behavioral clustering |
| `fetchAlerts(params)` | `/server/alerts_function` | Alert notifications |
| `fetchNetworkData(params)` | `/server/network_function` | Network analysis |
| `fetchRiskScores(params)` | `/server/risk_function` | District risk scores |

## 🔄 Automatic Fallback

All API functions automatically fall back to mock data if:
- API is unavailable
- Network error occurs
- Request timeout (30 seconds)
- Invalid response

This ensures the app works offline during development.

## 🛠️ Example: Update Dashboard Component

```javascript
import { useEffect, useState } from 'react';
import { fetchDashboardStats } from '@/utils/api';

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await fetchDashboardStats();
        setStats(data);
      } catch (error) {
        console.error('Failed to load dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Total FIRs: {stats.totalFIRs}</h2>
      <p>Active Cases: {stats.activeCases}</p>
      <p>Top District: {stats.topDistrict}</p>
    </div>
  );
}
```

## 🔐 Authentication

Authentication headers are automatically included from localStorage:

- `x-employee-role`: User role (SCRB_ADMIN, DISTRICT_OFFICER, etc.)
- `x-employee-email`: User email
- `x-employee-id`: Employee ID

These are set during login and automatically attached to all API requests.

## 🧪 Testing

### Check API Status

```javascript
import { checkApiHealth } from '@/config/api';

const health = await checkApiHealth();
console.log(health);
// { status: 'healthy', message: 'API is operational' }
// or
// { status: 'mock', message: 'Using mock data' }
```

### Verify Configuration

```javascript
import { API_INFO } from '@/config/api';

console.log(API_INFO);
// {
//   useMockApi: false,
//   baseUrl: 'https://...',
//   environment: 'production',
//   hasApiUrl: true
// }
```

## 📋 Migration Checklist

For each component using mock data:

- [ ] Import real API functions from `@/utils/api`
- [ ] Replace static mock constants with async API calls
- [ ] Add loading states
- [ ] Add error handling
- [ ] Test with both real API and mock fallback
- [ ] Update tests to mock the API functions

## 🐛 Troubleshooting

### "API failed, using mock data" warnings

**Cause**: API endpoint unavailable or VITE_API_URL not set  
**Solution**: Check Catalyst function deployment and environment variables

### CORS errors

**Cause**: Frontend origin not allowed by Catalyst  
**Solution**: Configure CORS in Catalyst Console → Functions → CORS Settings

### Authentication errors (401/403)

**Cause**: Invalid or missing auth headers  
**Solution**: Verify login flow sets correct localStorage values

### Timeout errors

**Cause**: Query taking >30 seconds  
**Solution**: Optimize database queries or add pagination

## 📚 Related Documentation

- [Database Setup Guide](../../database/QUICK_START.md)
- [Database API Reference](../../database/README.md)
- [Deployment Guide](../../docs/DATABASE_DEPLOYMENT_GUIDE.md)
- [Catalyst Functions](../../functions/README.md)

---

**Status**: ✅ API integration complete and ready for use  
**Mode**: Automatic fallback to mock data ensures development continues seamlessly
