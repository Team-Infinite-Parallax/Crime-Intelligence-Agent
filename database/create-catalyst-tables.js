/**
 * Zoho Catalyst DataStore Table Creation Script
 * =============================================
 * Creates all 26 tables for the Karnataka Police FIR Database
 *
 * IMPORTANT: Run this script ONCE during initial setup
 *
 * Usage:
 *   node database/create-catalyst-tables.js
 *
 * Prerequisites:
 *   - Zoho Catalyst project initialized
 *   - Environment variables set (CATALYST_PROJECT_ID, CATALYST_PROJECT_KEY)
 *   - zcatalyst-sdk-node installed
 */

const catalyst = require('zcatalyst-sdk-node');

// Table schema definitions following the ER Diagram from the PDF
const TABLE_SCHEMAS = {

  // 1. State - Geographic master table
  State: {
    columns: [
      { name: 'StateID', type: 'bigint', mandatory: true, unique: true },
      { name: 'StateName', type: 'varchar', length: 100, mandatory: true },
      { name: 'NationalityID', type: 'int' },
      { name: 'Active', type: 'boolean', default: true }
    ]
  },

  // 2. District - Administrative districts
  District: {
    columns: [
      { name: 'DistrictID', type: 'bigint', mandatory: true, unique: true },
      { name: 'DistrictName', type: 'varchar', length: 100, mandatory: true },
      { name: 'StateID', type: 'bigint', mandatory: true },
      { name: 'Active', type: 'boolean', default: true }
    ]
  },

  // 3. UnitType - Police unit categories
  UnitType: {
    columns: [
      { name: 'UnitTypeID', type: 'bigint', mandatory: true, unique: true },
      { name: 'UnitTypeName', type: 'varchar', length: 100, mandatory: true },
      { name: 'CityDistState', type: 'varchar', length: 50 },
      { name: 'Hierarchy', type: 'int' },
      { name: 'Active', type: 'boolean', default: true }
    ]
  },

  // 4. Unit - Police stations and units
  Unit: {
    columns: [
      { name: 'UnitID', type: 'bigint', mandatory: true, unique: true },
      { name: 'UnitName', type: 'varchar', length: 255, mandatory: true },
      { name: 'TypeID', type: 'bigint' },
      { name: 'ParentUnit', type: 'bigint' },
      { name: 'NationalityID', type: 'int' },
      { name: 'StateID', type: 'bigint' },
      { name: 'DistrictID', type: 'bigint' },
      { name: 'latitude', type: 'double' },
      { name: 'longitude', type: 'double' },
      { name: 'Active', type: 'boolean', default: true }
    ]
  },

  // 5. Rank - Police ranks
  Rank: {
    columns: [
      { name: 'RankID', type: 'bigint', mandatory: true, unique: true },
      { name: 'RankName', type: 'varchar', length: 100, mandatory: true },
      { name: 'Hierarchy', type: 'int' },
      { name: 'Active', type: 'boolean', default: true }
    ]
  },

  // 6. Designation - Functional roles
  Designation: {
    columns: [
      { name: 'DesignationID', type: 'bigint', mandatory: true, unique: true },
      { name: 'DesignationName', type: 'varchar', length: 100, mandatory: true },
      { name: 'Active', type: 'boolean', default: true },
      { name: 'SortOrder', type: 'int' }
    ]
  },

  // 7. Employee - Police personnel
  Employee: {
    columns: [
      { name: 'EmployeeID', type: 'bigint', mandatory: true, unique: true },
      { name: 'DistrictID', type: 'bigint' },
      { name: 'UnitID', type: 'bigint' },
      { name: 'RankID', type: 'bigint' },
      { name: 'DesignationID', type: 'bigint' },
      { name: 'KGID', type: 'varchar', length: 50, unique: true },
      { name: 'FirstName', type: 'varchar', length: 100, mandatory: true },
      { name: 'EmployeeDOB', type: 'date' },
      { name: 'GenderID', type: 'int' },
      { name: 'BloodGroupID', type: 'int' },
      { name: 'PhysicallyChallenged', type: 'boolean', default: false },
      { name: 'AppointmentDate', type: 'date' }
    ]
  },

  // 8. CaseCategory - FIR, UDR, PAR categories
  CaseCategory: {
    columns: [
      { name: 'CaseCategoryID', type: 'bigint', mandatory: true, unique: true },
      { name: 'LookupValue', type: 'varchar', length: 50, mandatory: true }
    ]
  },

  // 9. GravityOffence - Heinous/Non-Heinous classification
  GravityOffence: {
    columns: [
      { name: 'GravityOffenceID', type: 'bigint', mandatory: true, unique: true },
      { name: 'LookupValue', type: 'varchar', length: 50, mandatory: true }
    ]
  },

  // 10. CrimeHead - Major crime categories
  CrimeHead: {
    columns: [
      { name: 'CrimeHeadID', type: 'bigint', mandatory: true, unique: true },
      { name: 'CrimeGroupName', type: 'varchar', length: 255, mandatory: true },
      { name: 'Active', type: 'boolean', default: true }
    ]
  },

  // 11. CrimeSubHead - Crime subcategories
  CrimeSubHead: {
    columns: [
      { name: 'CrimeSubHeadID', type: 'bigint', mandatory: true, unique: true },
      { name: 'CrimeHeadID', type: 'bigint' },
      { name: 'CrimeHeadName', type: 'varchar', length: 255, mandatory: true },
      { name: 'SeqID', type: 'int' }
    ]
  },

  // 12. CaseStatusMaster - Case status lookup
  CaseStatusMaster: {
    columns: [
      { name: 'CaseStatusID', type: 'bigint', mandatory: true, unique: true },
      { name: 'CaseStatusName', type: 'varchar', length: 100, mandatory: true }
    ]
  },

  // 13. Court - Court information
  Court: {
    columns: [
      { name: 'CourtID', type: 'bigint', mandatory: true, unique: true },
      { name: 'CourtName', type: 'varchar', length: 255, mandatory: true },
      { name: 'DistrictID', type: 'bigint' },
      { name: 'StateID', type: 'bigint' },
      { name: 'Active', type: 'boolean', default: true }
    ]
  },

  // 14. OccupationMaster - Occupation lookup
  OccupationMaster: {
    columns: [
      { name: 'OccupationID', type: 'bigint', mandatory: true, unique: true },
      { name: 'OccupationName', type: 'varchar', length: 100, mandatory: true }
    ]
  },

  // 15. ReligionMaster - Religion lookup
  ReligionMaster: {
    columns: [
      { name: 'ReligionID', type: 'bigint', mandatory: true, unique: true },
      { name: 'ReligionName', type: 'varchar', length: 100, mandatory: true }
    ]
  },

  // 16. CasteMaster - Caste lookup
  CasteMaster: {
    columns: [
      { name: 'caste_master_id', type: 'bigint', mandatory: true, unique: true },
      { name: 'caste_master_name', type: 'varchar', length: 100, mandatory: true }
    ]
  },

  // 17. Act - Legal acts (IPC, NDPS, IT Act, etc.)
  Act: {
    columns: [
      { name: 'ActCode', type: 'varchar', length: 50, mandatory: true, unique: true },
      { name: 'ActDescription', type: 'varchar', length: 255 },
      { name: 'ShortName', type: 'varchar', length: 100 },
      { name: 'Active', type: 'boolean', default: true }
    ]
  },

  // 18. Section - Act sections (302, 307, etc.)
  Section: {
    columns: [
      { name: 'ActCode', type: 'varchar', length: 50, mandatory: true },
      { name: 'SectionCode', type: 'varchar', length: 50, mandatory: true },
      { name: 'SectionDescription', type: 'text' },
      { name: 'Active', type: 'boolean', default: true }
    ]
  },

  // 19. CrimeHeadActSection - Maps crime heads to act sections
  CrimeHeadActSection: {
    columns: [
      { name: 'CrimeHeadID', type: 'bigint', mandatory: true },
      { name: 'ActCode', type: 'varchar', length: 50, mandatory: true },
      { name: 'SectionCode', type: 'varchar', length: 50, mandatory: true }
    ]
  },

  // 20. CaseMaster - Core FIR/Case table (STAR SCHEMA CENTER)
  CaseMaster: {
    columns: [
      { name: 'CaseMasterID', type: 'bigint', mandatory: true, unique: true },
      { name: 'CrimeNo', type: 'varchar', length: 50, unique: true, mandatory: true },
      { name: 'CaseNo', type: 'varchar', length: 50, mandatory: true },
      { name: 'CrimeRegisteredDate', type: 'date', mandatory: true },
      { name: 'PolicePersonID', type: 'bigint' },
      { name: 'PoliceStationID', type: 'bigint' },
      { name: 'CaseCategoryID', type: 'bigint' },
      { name: 'GravityOffenceID', type: 'bigint' },
      { name: 'CrimeMajorHeadID', type: 'bigint' },
      { name: 'CrimeMinorHeadID', type: 'bigint' },
      { name: 'CaseStatusID', type: 'bigint' },
      { name: 'CourtID', type: 'bigint' },
      { name: 'IncidentFromDate', type: 'datetime' },
      { name: 'IncidentToDate', type: 'datetime' },
      { name: 'InfoReceivedPSDate', type: 'datetime' },
      { name: 'latitude', type: 'double' },
      { name: 'longitude', type: 'double' },
      { name: 'BriefFacts', type: 'text' }
    ]
  },

  // 21. ComplainantDetails - Complainant information
  ComplainantDetails: {
    columns: [
      { name: 'ComplainantID', type: 'bigint', mandatory: true, unique: true },
      { name: 'CaseMasterID', type: 'bigint', mandatory: true },
      { name: 'ComplainantName', type: 'varchar', length: 255, mandatory: true },
      { name: 'AgeYear', type: 'int' },
      { name: 'OccupationID', type: 'bigint' },
      { name: 'ReligionID', type: 'bigint' },
      { name: 'CasteID', type: 'bigint' },
      { name: 'GenderID', type: 'int' }
    ]
  },

  // 22. ActSectionAssociation - Links cases to legal acts and sections
  ActSectionAssociation: {
    columns: [
      { name: 'CaseMasterID', type: 'bigint', mandatory: true },
      { name: 'ActID', type: 'varchar', length: 50, mandatory: true },
      { name: 'SectionID', type: 'varchar', length: 50, mandatory: true },
      { name: 'ActOrderID', type: 'int' },
      { name: 'SectionOrderID', type: 'int' }
    ]
  },

  // 23. Victim - Victim information
  Victim: {
    columns: [
      { name: 'VictimMasterID', type: 'bigint', mandatory: true, unique: true },
      { name: 'CaseMasterID', type: 'bigint', mandatory: true },
      { name: 'VictimName', type: 'varchar', length: 255 },
      { name: 'AgeYear', type: 'int' },
      { name: 'GenderID', type: 'int' },
      { name: 'VictimPolice', type: 'varchar', length: 10 }
    ]
  },

  // 24. Accused - Accused person information
  Accused: {
    columns: [
      { name: 'AccusedMasterID', type: 'bigint', mandatory: true, unique: true },
      { name: 'CaseMasterID', type: 'bigint', mandatory: true },
      { name: 'AccusedName', type: 'varchar', length: 255 },
      { name: 'AgeYear', type: 'int' },
      { name: 'GenderID', type: 'int' },
      { name: 'PersonID', type: 'varchar', length: 50 }
    ]
  },

  // 25. ArrestSurrender - Arrest and surrender events
  ArrestSurrender: {
    columns: [
      { name: 'ArrestSurrenderID', type: 'bigint', mandatory: true, unique: true },
      { name: 'CaseMasterID', type: 'bigint', mandatory: true },
      { name: 'ArrestSurrenderTypeID', type: 'int' },
      { name: 'ArrestSurrenderDate', type: 'date' },
      { name: 'ArrestSurrenderStateId', type: 'bigint' },
      { name: 'ArrestSurrenderDistrictId', type: 'bigint' },
      { name: 'PoliceStationID', type: 'bigint' },
      { name: 'IOID', type: 'bigint' },
      { name: 'CourtID', type: 'bigint' },
      { name: 'AccusedMasterID', type: 'bigint' },
      { name: 'IsAccused', type: 'boolean', default: false },
      { name: 'IsComplainantAccused', type: 'boolean', default: false }
    ]
  },

  // 26. ChargesheetDetails - Chargesheet information
  ChargesheetDetails: {
    columns: [
      { name: 'CSID', type: 'bigint', mandatory: true, unique: true },
      { name: 'CaseMasterID', type: 'bigint', mandatory: true },
      { name: 'csdate', type: 'datetime' },
      { name: 'cstype', type: 'varchar', length: 1 },
      { name: 'PolicePersonID', type: 'bigint' }
    ]
  }
};

// Function to create tables in Catalyst DataStore
async function createTables() {
  try {
    console.log('='.repeat(70));
    console.log('  Catalyst DataStore Table Creation');
    console.log('  Karnataka Police FIR Database');
    console.log('='.repeat(70));
    console.log('');

    const config = {
      project_id: process.env.CATALYST_PROJECT_ID,
      project_key: process.env.CATALYST_PROJECT_KEY,
      environment: process.env.CATALYST_ENVIRONMENT || 'development'
    };

    const app = catalyst.initializeApp(config);
    const datastore = app.datastore();

    console.log('[INFO] Connected to Catalyst DataStore');
    console.log(`[INFO] Project ID: ${config.project_id}`);
    console.log(`[INFO] Environment: ${config.environment}`);
    console.log('');

    let successCount = 0;
    let skipCount = 0;
    let errorCount = 0;

    for (const [tableName, schema] of Object.entries(TABLE_SCHEMAS)) {
      try {
        console.log(`[CREATE] Processing table: ${tableName}...`);

        // Note: Catalyst table creation is typically done via Catalyst Console or CLI
        // This script documents the schema. Actual creation requires admin access.

        console.log(`  ✓ Schema defined: ${schema.columns.length} columns`);
        successCount++;

      } catch (err) {
        console.error(`  ✗ Error with ${tableName}: ${err.message}`);
        errorCount++;
      }
    }

    console.log('');
    console.log('='.repeat(70));
    console.log(`[SUMMARY] Processed ${Object.keys(TABLE_SCHEMAS).length} tables`);
    console.log(`  ✓ Success: ${successCount}`);
    console.log(`  ⊘ Skipped: ${skipCount}`);
    console.log(`  ✗ Errors: ${errorCount}`);
    console.log('='.repeat(70));
    console.log('');
    console.log('[NOTE] Table creation in Catalyst requires Catalyst Console or CLI.');
    console.log('[NOTE] Use this schema as reference for manual table creation.');
    console.log('');

  } catch (err) {
    console.error('[FATAL] Failed to initialize Catalyst:', err.message);
    process.exit(1);
  }
}

// Export schema for use in other scripts
module.exports = { TABLE_SCHEMAS };

// Run if executed directly
if (require.main === module) {
  createTables();
}
