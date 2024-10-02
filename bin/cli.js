#!/usr/bin/env node

const path = require('path');
const { execSync } = require('child_process');

const testRunnerPath = path.resolve(__dirname, '../dist/runner.js');

try {
  execSync(`node ${testRunnerPath} ${process.argv.slice(2).join(' ')}`, { stdio: 'inherit' });
} catch (error) {
  console.error('Error running the test runner:', error);
  process.exit(1);
}
