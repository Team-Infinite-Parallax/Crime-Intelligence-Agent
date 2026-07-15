/**
 * API Configuration for Crime Intelligence Platform
 * ==================================================
 * Configures endpoints for Catalyst serverless functions
 *
 * Environment Variables:
 * - VITE_API_URL: Base URL for Catalyst functions (required for production)
 * - VITE_USE_MOCK_API: Set to 'true' to force mock data (default: false)
 *
 * Usage:
 *   import { API_BASE_URL, API_ENDPOINTS } from '@/config/api';
 */

// Determine if we should use mock API
// Use mock API if explicitly enabled OR if no API URL is configured (development)
export const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === 'true' ||
                            !import.meta.env.VITE_API_URL;

// Base URL for Catalyst serverless functions
// Format: https://{project-id}-{region}.catalyst.zohoapis.com
export const API_BASE_URL = import.meta.env.VITE_API_URL ||
                            'https://catalyst-serverless.zohoapis.com';

// Catalyst function endpoints
export const API_ENDPOINTS = {
  // Dashboard & Statistics
  dashboard: '/server/dashboard_function',

  // Crime Hotspots
  hotspots: '/server/hotspots_function',

  // Case Listing & Search
  cases: '/server/crimelist_function',

  // Network Analysis
  network: '/server/network_function',

  // ML Predictions
  predictions: '/server/predictions_function',

  // Risk Scoring
  risk: '/server/risk_function',

  // Alert Generation
  alerts: '/server/alerts_function',

  // Clustering Analysis
  clustering: '/server/clustering_function',
};

// API configuration
export const API_CONFIG = {
  timeout: 30000, // 30 seconds
  retries: 2,
  retryDelay: 1000, // 1 second

  // Request headers
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};

// Get authentication headers from localStorage
export function getAuthHeaders() {
  return {
    'x-employee-role': localStorage.getItem('userRole') || 'SCRB_ADMIN',
    'x-employee-email': localStorage.getItem('userEmail') || 'admin@ksp.in',
    'x-employee-id': localStorage.getItem('employeeId') || '100',
  };
}

// Build full API URL
export function buildApiUrl(endpoint, params = {}) {
  const url = new URL(API_ENDPOINTS[endpoint] || endpoint, API_BASE_URL);

  // Add query parameters
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      url.searchParams.append(key, value);
    }
  });

  return url.toString();
}

// API status check
export async function checkApiHealth() {
  if (USE_MOCK_API) {
    return { status: 'mock', message: 'Using mock data' };
  }

  try {
    const response = await fetch(buildApiUrl('dashboard'), {
      method: 'GET',
      headers: { ...API_CONFIG.headers, ...getAuthHeaders() },
      signal: AbortSignal.timeout(5000),
    });

    return {
      status: response.ok ? 'healthy' : 'error',
      statusCode: response.status,
      message: response.ok ? 'API is operational' : `API returned ${response.status}`,
    };
  } catch (error) {
    return {
      status: 'error',
      message: error.message,
    };
  }
}

// Export environment info for debugging
export const API_INFO = {
  useMockApi: USE_MOCK_API,
  baseUrl: API_BASE_URL,
  environment: import.meta.env.MODE,
  hasApiUrl: !!import.meta.env.VITE_API_URL,
};
