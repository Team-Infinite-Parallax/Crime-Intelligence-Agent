/**
 * Real API Integration for Crime Intelligence Platform
 * ====================================================
 * Connects frontend to Catalyst serverless functions with database queries
 *
 * Features:
 * - Calls real Catalyst endpoints (dashboard, hotspots, cases, etc.)
 * - Automatic fallback to mock data if API unavailable
 * - Error handling and retry logic
 * - Authentication headers from localStorage
 *
 * Usage:
 *   import { fetchDashboardStats, fetchHotspots } from '@/utils/api';
 *
 *   const stats = await fetchDashboardStats();
 *   const hotspots = await fetchHotspots({ districtId: 1 });
 */

import {
  USE_MOCK_API,
  buildApiUrl,
  getAuthHeaders,
  API_CONFIG,
} from '../config/api';

import {
  MOCK_OUTCOMES,
  MOCK_FORECASTS,
  MOCK_ANOMALIES,
  MOCK_CLUSTERS,
  MOCK_TYPOLOGIES,
  MOCK_ALERTS,
} from './mockApi';

/**
 * Generic fetch with retry logic and fallback
 */
async function fetchWithRetry(url, options = {}, retries = API_CONFIG.retries) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...API_CONFIG.headers,
          ...getAuthHeaders(),
          ...options.headers,
        },
        signal: AbortSignal.timeout(API_CONFIG.timeout),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Response is not JSON');
      }

      return await response.json();
    } catch (error) {
      if (attempt < retries) {
        await new Promise(resolve => setTimeout(resolve, API_CONFIG.retryDelay));
        continue;
      }
      throw error;
    }
  }
}

/**
 * Fetch dashboard statistics
 * Endpoint: /server/dashboard_function
 */
export async function fetchDashboardStats() {
  if (USE_MOCK_API) {
    return {
      totalFIRs: 50000,
      activeCases: 35000,
      closedCases: 15000,
      todaysCrimes: 42,
      topDistrict: 'Bengaluru Urban',
      topCrime: 'Property Offences',
      averageInvestigationDays: 45,
    };
  }

  try {
    const url = buildApiUrl('dashboard');
    const data = await fetchWithRetry(url);
    return data;
  } catch (error) {
    console.warn('Dashboard API failed, using mock data:', error.message);
    return fetchDashboardStats.call({ USE_MOCK_API: true });
  }
}

/**
 * Fetch crime hotspots
 * Endpoint: /server/hotspots_function
 */
export async function fetchHotspots(params = {}) {
  if (USE_MOCK_API) {
    // Return mock hotspot data
    return {
      hotspots: Array.from({ length: 50 }, (_, i) => ({
        caseID: 1000 + i,
        crimeSubHeadID: (i % 10) + 1,
        registrationDate: `2026-07-${String(i % 30 + 1).padStart(2, '0')}`,
        incidentFromDate: `2026-07-${String(i % 30 + 1).padStart(2, '0')}`,
        latitude: 12.9716 + (Math.random() - 0.5) * 0.5,
        longitude: 77.5946 + (Math.random() - 0.5) * 0.5,
      })),
      count: 50,
    };
  }

  try {
    const url = buildApiUrl('hotspots', params);
    const data = await fetchWithRetry(url);
    return data;
  } catch (error) {
    console.warn('Hotspots API failed, using mock data:', error.message);
    return fetchHotspots.call({ USE_MOCK_API: true }, params);
  }
}

/**
 * Fetch case list with filters
 * Endpoint: /server/crimelist_function
 */
export async function fetchCases(filters = {}) {
  if (USE_MOCK_API) {
    return {
      cases: Array.from({ length: 20 }, (_, i) => ({
        caseId: 1000 + i,
        crimeNo: `10041202600${String(i + 1).padStart(3, '0')}`,
        caseNo: `202600${String(i + 1).padStart(3, '0')}`,
        registrationDate: `2026-07-${String(i % 30 + 1).padStart(2, '0')}`,
        crimeHead: ['Property Offences', 'Cyber Crimes', 'Crimes Against Body'][i % 3],
        crimeSubHead: ['Theft', 'Online Fraud', 'Assault'][i % 3],
        district: 'Bengaluru Urban',
        policeStation: 'Shivajinagar PS',
        status: ['Under Investigation', 'Charge Sheeted', 'Closed'][i % 3],
      })),
      total: 20,
    };
  }

  try {
    const url = buildApiUrl('cases', filters);
    const data = await fetchWithRetry(url);
    return data;
  } catch (error) {
    console.warn('Cases API failed, using mock data:', error.message);
    return fetchCases.call({ USE_MOCK_API: true }, filters);
  }
}

/**
 * Fetch ML predictions (case outcomes)
 * Endpoint: /server/predictions_function
 */
export async function fetchPredictions(params = {}) {
  if (USE_MOCK_API) {
    return { predictions: MOCK_OUTCOMES };
  }

  try {
    const url = buildApiUrl('predictions', params);
    const data = await fetchWithRetry(url);
    return data;
  } catch (error) {
    console.warn('Predictions API failed, using mock data:', error.message);
    return { predictions: MOCK_OUTCOMES };
  }
}

/**
 * Fetch crime trend forecasts
 * Endpoint: /server/predictions_function (forecast mode)
 */
export async function fetchForecasts(params = {}) {
  if (USE_MOCK_API) {
    return { forecasts: MOCK_FORECASTS };
  }

  try {
    const url = buildApiUrl('predictions', { ...params, type: 'forecast' });
    const data = await fetchWithRetry(url);
    return data;
  } catch (error) {
    console.warn('Forecasts API failed, using mock data:', error.message);
    return { forecasts: MOCK_FORECASTS };
  }
}

/**
 * Fetch anomaly detection results
 * Endpoint: /server/predictions_function (anomaly mode)
 */
export async function fetchAnomalies(params = {}) {
  if (USE_MOCK_API) {
    return { anomalies: MOCK_ANOMALIES };
  }

  try {
    const url = buildApiUrl('predictions', { ...params, type: 'anomaly' });
    const data = await fetchWithRetry(url);
    return data;
  } catch (error) {
    console.warn('Anomalies API failed, using mock data:', error.message);
    return { anomalies: MOCK_ANOMALIES };
  }
}

/**
 * Fetch behavioral clustering results
 * Endpoint: /server/clustering_function
 */
export async function fetchClusters(params = {}) {
  if (USE_MOCK_API) {
    return {
      clusters: MOCK_CLUSTERS,
      typologies: MOCK_TYPOLOGIES,
    };
  }

  try {
    const url = buildApiUrl('clustering', params);
    const data = await fetchWithRetry(url);
    return data;
  } catch (error) {
    console.warn('Clustering API failed, using mock data:', error.message);
    return {
      clusters: MOCK_CLUSTERS,
      typologies: MOCK_TYPOLOGIES,
    };
  }
}

/**
 * Fetch alert notifications
 * Endpoint: /server/alerts_function
 */
export async function fetchAlerts(params = {}) {
  if (USE_MOCK_API) {
    return { alerts: MOCK_ALERTS };
  }

  try {
    const url = buildApiUrl('alerts', params);
    const data = await fetchWithRetry(url);
    return data;
  } catch (error) {
    console.warn('Alerts API failed, using mock data:', error.message);
    return { alerts: MOCK_ALERTS };
  }
}

/**
 * Fetch network analysis data (accused-victim relationships)
 * Endpoint: /server/network_function
 */
export async function fetchNetworkData(params = {}) {
  if (USE_MOCK_API) {
    return {
      nodes: [
        { id: '1', name: 'Rajesh Kumar', type: 'accused', cases: 5 },
        { id: '2', name: 'Priya Sharma', type: 'victim', cases: 2 },
        { id: '3', name: 'Amit Patel', type: 'accused', cases: 3 },
      ],
      edges: [
        { source: '1', target: '2', caseId: '1001' },
        { source: '1', target: '3', caseId: '1002' },
      ],
    };
  }

  try {
    const url = buildApiUrl('network', params);
    const data = await fetchWithRetry(url);
    return data;
  } catch (error) {
    console.warn('Network API failed, using mock data:', error.message);
    return fetchNetworkData.call({ USE_MOCK_API: true }, params);
  }
}

/**
 * Fetch district risk scores
 * Endpoint: /server/risk_function
 */
export async function fetchRiskScores(params = {}) {
  if (USE_MOCK_API) {
    return {
      scores: [
        { district: 'Bengaluru Urban', riskScore: 78.5, category: 'HIGH' },
        { district: 'Mysuru', riskScore: 45.2, category: 'MEDIUM' },
        { district: 'Belagavi', riskScore: 32.1, category: 'LOW' },
      ],
    };
  }

  try {
    const url = buildApiUrl('risk', params);
    const data = await fetchWithRetry(url);
    return data;
  } catch (error) {
    console.warn('Risk API failed, using mock data:', error.message);
    return fetchRiskScores.call({ USE_MOCK_API: true }, params);
  }
}

/**
 * Export all API functions
 */
export const api = {
  fetchDashboardStats,
  fetchHotspots,
  fetchCases,
  fetchPredictions,
  fetchForecasts,
  fetchAnomalies,
  fetchClusters,
  fetchAlerts,
  fetchNetworkData,
  fetchRiskScores,
};

export default api;
