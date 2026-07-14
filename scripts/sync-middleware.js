const fs = require('fs');
const path = require('path');

const sourceFile = path.join(__dirname, '../functions/auth/middleware.js');
const targets = [
  'functions/alerts/authMiddleware.js',
  'functions/clustering/authMiddleware.js',
  'functions/crimelist/authMiddleware.js',
  'functions/dashboard/authMiddleware.js',
  'functions/hotspots/authMiddleware.js',
  'functions/network/authMiddleware.js',
  'functions/predictions/authMiddleware.js',
  'functions/risk/authMiddleware.js'
];

console.log('--- STARTING MIDDLEWARE SYNCHRONIZATION ---');
if (!fs.existsSync(sourceFile)) {
  console.error(`Error: Source middleware file not found at ${sourceFile}`);
  process.exit(1);
}

const content = fs.readFileSync(sourceFile, 'utf8');

targets.forEach(target => {
  const targetPath = path.join(__dirname, '../', target);
  const targetDir = path.dirname(targetPath);
  
  try {
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    
    fs.writeFileSync(targetPath, content, 'utf8');
    console.log(`Successfully synced: -> ${target}`);
  } catch (err) {
    console.error(`Failed to sync to ${target}:`, err.message);
  }
});
console.log('--- MIDDLEWARE SYNCHRONIZATION COMPLETE ---\n');
