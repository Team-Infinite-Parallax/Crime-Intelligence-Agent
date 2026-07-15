/**
 * Database Utility Functions for Zoho Catalyst DataStore
 * =======================================================
 * Provides reusable query functions for the Karnataka Police FIR Database
 *
 * Usage in Catalyst functions:
 *   const { queryCases, getHotspots, getDistrictStats } = require('../database/db-utils');
 *
 * @module database/db-utils
 */

const catalyst = require('zcatalyst-sdk-node');

/**
 * Initialize Catalyst app instance
 * @param {Object} req - Express request object (optional for Catalyst context)
 * @returns {Object} Catalyst app instance
 */
function initCatalyst(req = null) {
  if (req && req.catalyst) {
    return req.catalyst;
  }

  const config = {
    project_id: process.env.CATALYST_PROJECT_ID,
    project_key: process.env.CATALYST_PROJECT_KEY,
    environment: process.env.CATALYST_ENVIRONMENT || 'development'
  };

  return catalyst.initializeApp(config);
}

/**
 * Execute a CoQL query with error handling
 * @param {Object} datastore - Catalyst DataStore instance
 * @param {string} query - CoQL query string
 * @param {string} context - Description of query for logging
 * @returns {Promise<Array>} Query results
 */
async function executeCoQL(datastore, query, context = 'Query') {
  try {
    console.log(`[DB] ${context}:`, query);
    const result = await datastore.executeCoQLQuery(query);
    console.log(`[DB] ${context} returned ${result ? result.length : 0} rows`);
    return result || [];
  } catch (err) {
    console.error(`[DB ERROR] ${context}:`, err.message);
    throw new Error(`Database query failed: ${err.message}`);
  }
}

/**
 * Query cases with filters
 * @param {Object} app - Catalyst app instance
 * @param {Object} filters - Filter criteria
 * @param {string} filters.district - District name or ID
 * @param {string} filters.dateFrom - Start date (YYYY-MM-DD)
 * @param {string} filters.dateTo - End date (YYYY-MM-DD)
 * @param {string} filters.crimeType - Crime head/subhead name
 * @param {number} filters.limit - Maximum results (default 1000)
 * @returns {Promise<Array>} Filtered cases
 */
async function queryCases(app, filters = {}) {
  const datastore = app.datastore();
  const {
    district = null,
    dateFrom = null,
    dateTo = null,
    crimeType = null,
    limit = 1000
  } = filters;

  let whereClause = [];

  if (district) {
    whereClause.push(`PoliceStationID IN (SELECT UnitID FROM Unit WHERE DistrictID = ${district})`);
  }

  if (dateFrom) {
    whereClause.push(`CrimeRegisteredDate >= '${dateFrom}'`);
  }

  if (dateTo) {
    whereClause.push(`CrimeRegisteredDate <= '${dateTo}'`);
  }

  const where = whereClause.length > 0 ? `WHERE ${whereClause.join(' AND ')}` : '';

  const query = `
    SELECT CaseMasterID, CrimeNo, CaseNo, CrimeRegisteredDate,
           PoliceStationID, CaseCategoryID, GravityOffenceID,
           CrimeMajorHeadID, CrimeMinorHeadID, CaseStatusID,
           latitude, longitude, BriefFacts
    FROM CaseMaster
    ${where}
    ORDER BY CrimeRegisteredDate DESC
    LIMIT ${limit}
  `;

  return await executeCoQL(datastore, query, 'Query Cases');
}

/**
 * Get crime hotspots with spatial clustering
 * @param {Object} app - Catalyst app instance
 * @param {Object} params - Parameters
 * @param {number} params.districtId - District ID filter
 * @param {string} params.dateFrom - Start date
 * @param {string} params.dateTo - End date
 * @returns {Promise<Array>} Hotspot locations with crime counts
 */
async function getHotspots(app, params = {}) {
  const datastore = app.datastore();
  const { districtId = null, dateFrom = null, dateTo = null } = params;

  let whereClause = ['latitude IS NOT NULL', 'longitude IS NOT NULL'];

  if (districtId) {
    whereClause.push(`PoliceStationID IN (SELECT UnitID FROM Unit WHERE DistrictID = ${districtId})`);
  }

  if (dateFrom) {
    whereClause.push(`CrimeRegisteredDate >= '${dateFrom}'`);
  }

  if (dateTo) {
    whereClause.push(`CrimeRegisteredDate <= '${dateTo}'`);
  }

  const where = `WHERE ${whereClause.join(' AND ')}`;

  const query = `
    SELECT latitude, longitude, CrimeMajorHeadID, CrimeMinorHeadID,
           COUNT(*) as crime_count
    FROM CaseMaster
    ${where}
    GROUP BY latitude, longitude, CrimeMajorHeadID, CrimeMinorHeadID
    ORDER BY crime_count DESC
    LIMIT 500
  `;

  return await executeCoQL(datastore, query, 'Get Hotspots');
}

/**
 * Get district-level crime statistics
 * @param {Object} app - Catalyst app instance
 * @param {number} districtId - District ID (optional)
 * @returns {Promise<Array>} District statistics
 */
async function getDistrictStats(app, districtId = null) {
  const datastore = app.datastore();

  const where = districtId
    ? `WHERE PoliceStationID IN (SELECT UnitID FROM Unit WHERE DistrictID = ${districtId})`
    : '';

  const query = `
    SELECT
      U.DistrictID,
      D.DistrictName,
      COUNT(CM.CaseMasterID) as total_cases,
      SUM(CASE WHEN CM.GravityOffenceID = 1 THEN 1 ELSE 0 END) as heinous_cases,
      SUM(CASE WHEN CM.CaseStatusID = 3 THEN 1 ELSE 0 END) as closed_cases
    FROM CaseMaster CM
    INNER JOIN Unit U ON CM.PoliceStationID = U.UnitID
    INNER JOIN District D ON U.DistrictID = D.DistrictID
    ${where}
    GROUP BY U.DistrictID, D.DistrictName
    ORDER BY total_cases DESC
  `;

  return await executeCoQL(datastore, query, 'Get District Stats');
}

/**
 * Get crime trends over time
 * @param {Object} app - Catalyst app instance
 * @param {Object} params - Parameters
 * @param {string} params.groupBy - Group by 'day', 'week', 'month', 'year'
 * @param {string} params.dateFrom - Start date
 * @param {string} params.dateTo - End date
 * @returns {Promise<Array>} Time-series crime data
 */
async function getCrimeTrends(app, params = {}) {
  const datastore = app.datastore();
  const { groupBy = 'month', dateFrom = null, dateTo = null } = params;

  let whereClause = [];
  if (dateFrom) whereClause.push(`CrimeRegisteredDate >= '${dateFrom}'`);
  if (dateTo) whereClause.push(`CrimeRegisteredDate <= '${dateTo}'`);
  const where = whereClause.length > 0 ? `WHERE ${whereClause.join(' AND ')}` : '';

  // Date formatting based on groupBy (simplified for Catalyst CoQL)
  const dateFormat = {
    day: 'CrimeRegisteredDate',
    week: 'CrimeRegisteredDate', // Week requires custom logic
    month: 'SUBSTRING(CrimeRegisteredDate, 1, 7)',
    year: 'SUBSTRING(CrimeRegisteredDate, 1, 4)'
  }[groupBy] || 'SUBSTRING(CrimeRegisteredDate, 1, 7)';

  const query = `
    SELECT
      ${dateFormat} as period,
      COUNT(*) as case_count,
      SUM(CASE WHEN GravityOffenceID = 1 THEN 1 ELSE 0 END) as heinous_count
    FROM CaseMaster
    ${where}
    GROUP BY ${dateFormat}
    ORDER BY period ASC
  `;

  return await executeCoQL(datastore, query, 'Get Crime Trends');
}

/**
 * Get network analysis data (accused-victim relationships)
 * @param {Object} app - Catalyst app instance
 * @param {Object} params - Parameters
 * @param {number} params.limit - Maximum results
 * @returns {Promise<Object>} Network nodes and edges
 */
async function getNetworkData(app, params = {}) {
  const datastore = app.datastore();
  const { limit = 500 } = params;

  // Get accused-case relationships
  const accusedQuery = `
    SELECT A.AccusedMasterID, A.AccusedName, A.CaseMasterID, A.AgeYear, A.GenderID
    FROM Accused A
    INNER JOIN CaseMaster CM ON A.CaseMasterID = CM.CaseMasterID
    WHERE A.AccusedName IS NOT NULL
    ORDER BY CM.CrimeRegisteredDate DESC
    LIMIT ${limit}
  `;

  const accused = await executeCoQL(datastore, accusedQuery, 'Get Accused Network');

  // Get victim-case relationships
  const victimQuery = `
    SELECT V.VictimMasterID, V.VictimName, V.CaseMasterID, V.AgeYear, V.GenderID
    FROM Victim V
    INNER JOIN CaseMaster CM ON V.CaseMasterID = CM.CaseMasterID
    WHERE V.VictimName IS NOT NULL
    ORDER BY CM.CrimeRegisteredDate DESC
    LIMIT ${limit}
  `;

  const victims = await executeCoQL(datastore, victimQuery, 'Get Victim Network');

  return {
    accused,
    victims,
    timestamp: new Date().toISOString()
  };
}

/**
 * Get repeat offender analysis
 * @param {Object} app - Catalyst app instance
 * @param {number} minCases - Minimum case count to be flagged
 * @returns {Promise<Array>} Repeat offenders
 */
async function getRepeatOffenders(app, minCases = 2) {
  const datastore = app.datastore();

  const query = `
    SELECT
      AccusedName,
      COUNT(DISTINCT CaseMasterID) as case_count,
      MIN(AgeYear) as age,
      GenderID
    FROM Accused
    WHERE AccusedName IS NOT NULL
    GROUP BY AccusedName, GenderID
    HAVING COUNT(DISTINCT CaseMasterID) >= ${minCases}
    ORDER BY case_count DESC
    LIMIT 100
  `;

  return await executeCoQL(datastore, query, 'Get Repeat Offenders');
}

/**
 * Get case details by CrimeNo or CaseMasterID
 * @param {Object} app - Catalyst app instance
 * @param {string|number} identifier - CrimeNo or CaseMasterID
 * @returns {Promise<Object>} Complete case details
 */
async function getCaseDetails(app, identifier) {
  const datastore = app.datastore();

  const isNumeric = !isNaN(identifier);
  const whereClause = isNumeric
    ? `CaseMasterID = ${identifier}`
    : `CrimeNo = '${identifier}'`;

  // Get case master data
  const caseQuery = `
    SELECT * FROM CaseMaster WHERE ${whereClause}
  `;
  const cases = await executeCoQL(datastore, caseQuery, 'Get Case Master');

  if (!cases || cases.length === 0) {
    return null;
  }

  const caseData = cases[0].CaseMaster;
  const caseId = caseData.CaseMasterID;

  // Get related data in parallel
  const [accused, victims, complainants, acts] = await Promise.all([
    executeCoQL(datastore, `SELECT * FROM Accused WHERE CaseMasterID = ${caseId}`, 'Get Accused'),
    executeCoQL(datastore, `SELECT * FROM Victim WHERE CaseMasterID = ${caseId}`, 'Get Victims'),
    executeCoQL(datastore, `SELECT * FROM ComplainantDetails WHERE CaseMasterID = ${caseId}`, 'Get Complainants'),
    executeCoQL(datastore, `SELECT * FROM ActSectionAssociation WHERE CaseMasterID = ${caseId}`, 'Get Acts')
  ]);

  return {
    case: caseData,
    accused: accused.map(a => a.Accused),
    victims: victims.map(v => v.Victim),
    complainants: complainants.map(c => c.ComplainantDetails),
    acts: acts.map(a => a.ActSectionAssociation),
    timestamp: new Date().toISOString()
  };
}

/**
 * Get crime type distribution
 * @param {Object} app - Catalyst app instance
 * @param {Object} filters - Optional filters
 * @returns {Promise<Array>} Crime type counts
 */
async function getCrimeTypeDistribution(app, filters = {}) {
  const datastore = app.datastore();
  const { districtId = null, dateFrom = null, dateTo = null } = filters;

  let whereClause = [];
  if (districtId) {
    whereClause.push(`PoliceStationID IN (SELECT UnitID FROM Unit WHERE DistrictID = ${districtId})`);
  }
  if (dateFrom) whereClause.push(`CrimeRegisteredDate >= '${dateFrom}'`);
  if (dateTo) whereClause.push(`CrimeRegisteredDate <= '${dateTo}'`);

  const where = whereClause.length > 0 ? `WHERE ${whereClause.join(' AND ')}` : '';

  const query = `
    SELECT
      CH.CrimeGroupName as crime_head,
      CSH.CrimeHeadName as crime_subhead,
      COUNT(*) as count
    FROM CaseMaster CM
    LEFT JOIN CrimeHead CH ON CM.CrimeMajorHeadID = CH.CrimeHeadID
    LEFT JOIN CrimeSubHead CSH ON CM.CrimeMinorHeadID = CSH.CrimeSubHeadID
    ${where}
    GROUP BY CH.CrimeGroupName, CSH.CrimeHeadName
    ORDER BY count DESC
  `;

  return await executeCoQL(datastore, query, 'Get Crime Type Distribution');
}

// Export all functions
module.exports = {
  initCatalyst,
  executeCoQL,
  queryCases,
  getHotspots,
  getDistrictStats,
  getCrimeTrends,
  getNetworkData,
  getRepeatOffenders,
  getCaseDetails,
  getCrimeTypeDistribution
};
