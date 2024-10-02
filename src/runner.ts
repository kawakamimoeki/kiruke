import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

async function main() {
  const filePaths = fs.readdirSync(process.cwd()).filter(filePath => filePath.endsWith('.kiruke.ts') || filePath.endsWith('.kiruke.js'));
  if (filePaths.length === 0) {
    console.error('Please specify a file to run');
    process.exit(1);
  }

  filePaths.forEach(filePath => {
    const absolutePath = path.resolve(filePath);
    if (!fs.existsSync(absolutePath)) {
      console.error(`File not found: ${absolutePath}`);
      process.exit(1);
    }

    try {
      execSync(`npx ts-node ${absolutePath}`, { stdio: 'inherit' });
    } catch (error) {
      console.error('Error running the tests:', error);
      process.exit(1);
    }
  });
}

main().catch(console.error);
