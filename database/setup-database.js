#!/usr/bin/env node
/**
 * Karnataka Police FIR Database - Master Setup Script
 * ====================================================
 * Orchestrates complete database setup from schema creation to data import
 *
 * Usage:
 *   node database/setup-database.js [--step=<step>] [--skip-data]
 *
 * Steps:
 *   1. validate    - Check prerequisites (Python, Node, Catalyst SDK)
 *   2. generate    - Generate synthetic FIR data (50,000 records)
 *   3. import      - Import CSV data into Catalyst DataStore
 *   4. verify      - Verify database integrity and record counts
 *
 * Options:
 *   --step=<n>     Run specific step only (1-4)
 *   --skip-data    Skip data generation (use existing CSV files)
 *   --test-only    Generate only 1,000 test records
 *   --help         Show this help message
 *
 * Prerequisites:
 *   - Zoho Catalyst project initialized
 *   - Environment variables set (CATALYST_PROJECT_ID, CATALYST_PROJECT_KEY)
 *   - Python 3.8+ with faker, pandas, numpy
 *   - Node.js v14+ with zcatalyst-sdk-node
 */

const { spawn, execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const PROJECT_ROOT = path.join(__dirname, '..');
const DATA_GEN_DIR = path.join(PROJECT_ROOT, 'data-generator');
const OUTPUT_DIR = path.join(DATA_GEN_DIR, 'output');
const PYTHON_SCRIPT = path.join(DATA_GEN_DIR, 'generate.py');
const IMPORT_SCRIPT = path.join(DATA_GEN_DIR, 'import-data.js');

// Parse command line arguments
const args = process.argv.slice(2);
const options = {
  step: null,
  skipData: args.includes('--skip-data'),
  testOnly: args.includes('--test-only'),
  help: args.includes('--help')
};

// Extract step number if provided
const stepArg = args.find(arg => arg.startsWith('--step='));
if (stepArg) {
  options.step = parseInt(stepArg.split('=')[1]);
}

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
  console.log('');
  log('═'.repeat(70), 'cyan');
  log(`  ${title}`, 'bright');
  log('═'.repeat(70), 'cyan');
}

function logStep(step, message) {
  log(`[STEP ${step}] ${message}`, 'blue');
}

function logSuccess(message) {
  log(`✓ ${message}`, 'green');
}

function logError(message) {
  log(`✗ ${message}`, 'red');
}

function logWarning(message) {
  log(`⚠ ${message}`, 'yellow');
}

function showHelp() {
  console.log(`
${colors.bright}Karnataka Police FIR Database Setup${colors.reset}

${colors.cyan}Usage:${colors.reset}
  node database/setup-database.js [options]

${colors.cyan}Options:${colors.reset}
  --step=<n>      Run specific step only (1-4)
  --skip-data     Skip data generation (use existing CSV files)
  --test-only     Generate only 1,000 test records instead of 50,000
  --help          Show this help message

${colors.cyan}Steps:${colors.reset}
  1. Validate prerequisites
  2. Generate synthetic FIR data
  3. Import data to Catalyst DataStore
  4. Verify database integrity

${colors.cyan}Examples:${colors.reset}
  node database/setup-database.js
    → Run full setup with 50,000 records

  node database/setup-database.js --test-only
    → Run full setup with 1,000 test records

  node database/setup-database.js --step=3
    → Run import step only (assumes data already generated)

  node database/setup-database.js --skip-data
    → Skip data generation, proceed to import

${colors.cyan}Prerequisites:${colors.reset}
  • Catalyst tables created in Catalyst Console
  • Environment variables: CATALYST_PROJECT_ID, CATALYST_PROJECT_KEY
  • Python 3.8+ with: pip install faker pandas numpy
  • Node.js v14+ with: npm install zcatalyst-sdk-node
`);
}

// Step 1: Validate Prerequisites
async function validatePrerequisites() {
  logStep(1, 'Validating prerequisites...');

  const checks = {
    python: false,
    node: false,
    catalyst: false,
    env: false,
    dirs: false
  };

  // Check Python
  try {
    const pythonVersion = execSync('python --version 2>&1', { encoding: 'utf8' });
    log(`  Python: ${pythonVersion.trim()}`);
    checks.python = true;
  } catch (err) {
    logError('Python not found. Please install Python 3.8+');
  }

  // Check Node.js
  try {
    const nodeVersion = execSync('node --version', { encoding: 'utf8' });
    log(`  Node.js: ${nodeVersion.trim()}`);
    checks.node = true;
  } catch (err) {
    logError('Node.js not found. Please install Node.js v14+');
  }

  // Check Catalyst SDK
  try {
    require.resolve('zcatalyst-sdk-node');
    logSuccess('Catalyst SDK installed');
    checks.catalyst = true;
  } catch (err) {
    logError('Catalyst SDK not found. Run: npm install zcatalyst-sdk-node');
  }

  // Check environment variables
  const requiredEnvVars = ['CATALYST_PROJECT_ID', 'CATALYST_PROJECT_KEY'];
  const missingVars = requiredEnvVars.filter(v => !process.env[v]);

  if (missingVars.length === 0) {
    logSuccess('Environment variables configured');
    log(`  Project ID: ${process.env.CATALYST_PROJECT_ID}`);
    checks.env = true;
  } else {
    logError(`Missing environment variables: ${missingVars.join(', ')}`);
  }

  // Check directories
  if (fs.existsSync(DATA_GEN_DIR) && fs.existsSync(PYTHON_SCRIPT)) {
    logSuccess('Data generator directory found');
    checks.dirs = true;
  } else {
    logError('Data generator directory or script not found');
  }

  // Check Python packages
  try {
    execSync('python -c "import faker, pandas, numpy"', { stdio: 'ignore' });
    logSuccess('Required Python packages installed');
  } catch (err) {
    logWarning('Missing Python packages. Run: pip install faker pandas numpy');
  }

  const allChecks = Object.values(checks).every(v => v);
  if (allChecks) {
    logSuccess('All prerequisites satisfied');
    return true;
  } else {
    logError('Some prerequisites are missing. Please resolve before continuing.');
    return false;
  }
}

// Step 2: Generate Synthetic Data
function generateData(testOnly = false) {
  return new Promise((resolve, reject) => {
    logStep(2, `Generating synthetic FIR data (${testOnly ? '1,000 test' : '50,000'} records)...`);

    const pythonArgs = testOnly ? ['--test'] : [];
    const pythonProcess = spawn('python', [PYTHON_SCRIPT, ...pythonArgs], {
      cwd: DATA_GEN_DIR,
      stdio: 'inherit'
    });

    pythonProcess.on('close', (code) => {
      if (code === 0) {
        logSuccess('Data generation completed');

        // Verify output files
        if (fs.existsSync(OUTPUT_DIR)) {
          const csvFiles = fs.readdirSync(OUTPUT_DIR).filter(f => f.endsWith('.csv'));
          log(`  Generated ${csvFiles.length} CSV files`);
          resolve();
        } else {
          logError('Output directory not found');
          reject(new Error('Output directory not created'));
        }
      } else {
        logError(`Data generation failed with code ${code}`);
        reject(new Error(`Python script exited with code ${code}`));
      }
    });

    pythonProcess.on('error', (err) => {
      logError(`Failed to start Python process: ${err.message}`);
      reject(err);
    });
  });
}

// Step 3: Import Data to Catalyst
function importData() {
  return new Promise((resolve, reject) => {
    logStep(3, 'Importing data to Catalyst DataStore...');
    log('  This may take 10-30 minutes for 50,000 records');

    const importProcess = spawn('node', [IMPORT_SCRIPT], {
      cwd: DATA_GEN_DIR,
      stdio: 'inherit',
      env: { ...process.env }
    });

    importProcess.on('close', (code) => {
      if (code === 0) {
        logSuccess('Data import completed');
        resolve();
      } else {
        logError(`Data import failed with code ${code}`);
        reject(new Error(`Import script exited with code ${code}`));
      }
    });

    importProcess.on('error', (err) => {
      logError(`Failed to start import process: ${err.message}`);
      reject(err);
    });
  });
}

// Step 4: Verify Database
async function verifyDatabase() {
  logStep(4, 'Verifying database integrity...');

  try {
    const catalyst = require('zcatalyst-sdk-node');
    const { queryCases, getDistrictStats } = require('./db-utils');

    const config = {
      project_id: process.env.CATALYST_PROJECT_ID,
      project_key: process.env.CATALYST_PROJECT_KEY,
      environment: process.env.CATALYST_ENVIRONMENT || 'development'
    };

    const app = catalyst.initializeApp(config);
    const datastore = app.datastore();

    // Verify CaseMaster table
    log('  Checking CaseMaster table...');
    const caseCountQuery = 'SELECT COUNT(*) as total FROM CaseMaster';
    const caseResult = await datastore.executeCoQLQuery(caseCountQuery);
    const caseCount = caseResult[0]?.CaseMaster?.total || 0;
    log(`    ✓ Cases: ${caseCount}`);

    // Verify District table
    log('  Checking District table...');
    const districtQuery = 'SELECT COUNT(*) as total FROM District';
    const districtResult = await datastore.executeCoQLQuery(districtQuery);
    const districtCount = districtResult[0]?.District?.total || 0;
    log(`    ✓ Districts: ${districtCount}`);

    // Verify Accused table
    log('  Checking Accused table...');
    const accusedQuery = 'SELECT COUNT(*) as total FROM Accused';
    const accusedResult = await datastore.executeCoQLQuery(accusedQuery);
    const accusedCount = accusedResult[0]?.Accused?.total || 0;
    log(`    ✓ Accused: ${accusedCount}`);

    // Verify Victim table
    log('  Checking Victim table...');
    const victimQuery = 'SELECT COUNT(*) as total FROM Victim';
    const victimResult = await datastore.executeCoQLQuery(victimQuery);
    const victimCount = victimResult[0]?.Victim?.total || 0;
    log(`    ✓ Victims: ${victimCount}`);

    if (caseCount > 0) {
      logSuccess('Database verification completed successfully');
      log(`  Total Cases: ${caseCount}`);
      log(`  Total Districts: ${districtCount}`);
      log(`  Total Accused: ${accusedCount}`);
      log(`  Total Victims: ${victimCount}`);
      return true;
    } else {
      logWarning('Database is empty. Import may have failed.');
      return false;
    }

  } catch (err) {
    logError(`Verification failed: ${err.message}`);
    log('  This may be normal if tables are not yet created in Catalyst Console');
    return false;
  }
}

// Main execution
async function main() {
  if (options.help) {
    showHelp();
    process.exit(0);
  }

  logSection('Karnataka Police FIR Database Setup');
  log('  Crime Intelligence & Analytical Platform');
  log('  Database Implementation from Official ER Diagram');
  console.log('');

  try {
    // Run specific step or full setup
    if (options.step) {
      log(`Running step ${options.step} only\n`);

      switch (options.step) {
        case 1:
          const valid = await validatePrerequisites();
          process.exit(valid ? 0 : 1);
        case 2:
          await generateData(options.testOnly);
          break;
        case 3:
          await importData();
          break;
        case 4:
          await verifyDatabase();
          break;
        default:
          logError(`Invalid step: ${options.step}. Must be 1-4`);
          process.exit(1);
      }
    } else {
      // Full setup
      const valid = await validatePrerequisites();
      if (!valid) {
        logError('Prerequisites check failed. Aborting setup.');
        process.exit(1);
      }

      if (!options.skipData) {
        await generateData(options.testOnly);
      } else {
        logWarning('Skipping data generation (--skip-data flag)');
      }

      await importData();
      await verifyDatabase();
    }

    logSection('Setup Complete');
    logSuccess('Database setup completed successfully!');
    log('\nNext steps:');
    log('  1. Verify data in Catalyst Console: https://console.catalyst.zoho.com');
    log('  2. Test API endpoints: node functions/<function-name>/index.js');
    log('  3. Start the frontend: npm run dev');
    console.log('');

  } catch (err) {
    logSection('Setup Failed');
    logError(`Setup failed: ${err.message}`);
    console.error(err);
    process.exit(1);
  }
}

// Handle SIGINT (Ctrl+C)
process.on('SIGINT', () => {
  console.log('');
  logWarning('Setup interrupted by user');
  process.exit(130);
});

// Run main function
main();
