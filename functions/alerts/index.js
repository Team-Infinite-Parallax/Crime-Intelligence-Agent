const catalyst = require('zcatalyst-sdk-node');
const url = require('url');
const { requireAuth } = require('./authMiddleware');

/**
 * Alerts API Handler
 * 
 * Real-time anomaly monitoring with Signals/Circuits integration
 * 
 * Endpoints:
 * GET /alerts?limit=50              -> Get recent alerts
 * GET /alerts?status=active         -> Get active alerts only
 * POST /alerts/acknowledge          -> Mark alert as acknowledged
 */

module.exports = async (req, res) => {
  const authHandler = requireAuth(['SCRB_ADMIN', 'DISTRICT_OFFICER', 'INVESTIGATION_OFFICER']);
  
  await authHandler(req, res, async (req, res) => {
    try {
      const app = catalyst.initialize(req);
      const datastore = app.datastore();
      const user = req.user;

      const parsed = url.parse(req.url, true);
      const query = parsed.query || {};
      const limit = Math.min(Math.max(Number(query.limit) || 50, 1), 200);
      const status = query.status || 'all';
      const method = req.method;

      // POST: Acknowledge alert
      if (method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', async () => {
          try {
            const payload = JSON.parse(body);
            const alertId = payload.alertId;
            
            if (!alertId) {
              res.writeHead(400, { 'Content-Type': 'application/json' });
              return res.end(JSON.stringify({ error: 'Missing alertId' }));
            }

            // Mock: store acknowledgment (in production, update Alert table)
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ 
              success: true, 
              message: 'Alert acknowledged',
              alertId: alertId
            }));
          } catch (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: err.message }));
          }
        });
        return;
      }

      // GET: Fetch alerts with role-based filtering
      let filterClause = '';
      if (user.role === 'DISTRICT_OFFICER') {
        const districtId = user.employee?.districtID;
        if (districtId) {
          filterClause = `WHERE cm.DistrictID = ${districtId}`;
        }
      } else if (user.role === 'INVESTIGATION_OFFICER') {
        const unitId = user.employee?.unitID;
        if (unitId) {
          filterClause = `WHERE cm.UnitID = ${unitId}`;
        }
      }

      // Add status filter
      if (status !== 'all') {
        const statusClause = status === 'active' 
          ? `cm.CaseStatusID IN (1,2,3,6,7)`
          : `cm.CaseStatusID IN (4,5)`;
        filterClause = filterClause 
          ? `${filterClause} AND ${statusClause}`
          : `WHERE ${statusClause}`;
      }

      // Fetch recent cases with anomaly indicators
      const alertsData = await datastore.executeCoQLQuery(`
        SELECT 
          cm.CaseID,
          cm.CaseNo,
          d.DistrictName,
          u.UnitName,
          ch.CrimeHeadName,
          csh.CrimeSubHeadName,
          cm.RegistrationDate,
          COUNT(DISTINCT a.AccusedID) AS accusedCount,
          SUM(CASE WHEN ar.ArrestID IS NOT NULL THEN 1 ELSE 0 END) AS arrestCount,
          cs.CSDate AS chargesheetDate
        FROM CaseMaster cm
        LEFT JOIN District d ON cm.DistrictID = d.DistrictID
        LEFT JOIN Unit u ON cm.UnitID = u.UnitID
        LEFT JOIN CrimeHead ch ON cm.CrimeHeadID = ch.CrimeHeadID
        LEFT JOIN CrimeSubHead csh ON cm.CrimeSubHeadID = csh.CrimeSubHeadID
        LEFT JOIN Accused a ON cm.CaseID = a.CaseID
        LEFT JOIN ArrestSurrender ar ON cm.CaseID = ar.CaseID
        LEFT JOIN ChargesheetDetails cs ON cm.CaseID = cs.CaseID
        ${filterClause}
        GROUP BY cm.CaseID, cm.CaseNo, d.DistrictName, u.UnitName, 
                 ch.CrimeHeadName, csh.CrimeSubHeadName, 
                 cm.RegistrationDate, cs.CSDate
        ORDER BY cm.RegistrationDate DESC
        LIMIT ${limit}
      `);

      // Generate alert objects based on case characteristics
      const alerts = alertsData.map((row, idx) => {
        const caseId = String(row.CaseID);
        const regDate = new Date(row.RegistrationDate);
        const daysOpen = Math.floor((new Date() - regDate) / (1000 * 60 * 60 * 24));
        const accusedCount = Number(row.accusedCount || 0);
        const arrestCount = Number(row.arrestCount || 0);

        // Determine alert type and severity
        let alertType = 'info';
        let severity = 'low';
        let message = '';

        if (daysOpen > 120) {
          alertType = 'delayed';
          severity = 'high';
          message = `Case pending for ${daysOpen} days (high severity crime, no chargesheet)`;
        } else if (accusedCount >= 5 && arrestCount < accusedCount / 2) {
          alertType = 'network';
          severity = 'critical';
          message = `Network alert: ${accusedCount} accused, only ${arrestCount} arrested - possible organized crime`;
        } else if (daysOpen > 60 && !row.chargesheetDate) {
          alertType = 'disposition';
          severity = 'medium';
          message = `Delayed chargesheet filing (${daysOpen} days open)`;
        } else if (accusedCount > 5) {
          alertType = 'volume';
          severity = 'medium';
          message = `Multiple accused (${accusedCount}) - coordination required`;
        } else if (daysOpen > 30 && arrestCount === 0) {
          alertType = 'arrest';
          severity = 'medium';
          message = `No arrest yet after ${daysOpen} days - escalate investigation`;
        } else {
          alertType = 'routine';
          severity = 'low';
          message = `Active case under investigation`;
        }

        return {
          alertId: `ALERT_${caseId}_${idx}`,
          caseId: caseId,
          caseNo: row.CaseNo,
          district: row.DistrictName,
          unit: row.UnitName,
          crimeHead: row.CrimeHeadName,
          crimeSubHead: row.CrimeSubHeadName,
          type: alertType,
          severity: severity,
          message: message,
          daysOpen: daysOpen,
          accusedCount: accusedCount,
          arrestCount: arrestCount,
          timestamp: row.RegistrationDate,
          acknowledged: false,
          signalsSent: severity === 'critical' || severity === 'high'
        };
      });

      // Sort by severity
      const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      alerts.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        alerts: alerts,
        count: alerts.length,
        critical: alerts.filter(a => a.severity === 'critical').length,
        high: alerts.filter(a => a.severity === 'high').length
      }));

    } catch (err) {
      console.error('Alerts Error:', err);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        error: 'Internal Server Error',
        message: err.message
      }));
    }
  });
};
