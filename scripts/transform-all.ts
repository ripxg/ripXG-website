#!/usr/bin/env tsx
/**
 * Transform Orchestration: Run All Platform Transforms
 *
 * Executes all transform scripts in sequence to generate
 * platform-specific content from the source MD files.
 */

import { execSync } from 'child_process';
import path from 'path';

const SCRIPTS_DIR = path.join(process.cwd(), 'scripts');

/**
 * Run a transform script
 */
function runTransform(scriptName: string): void {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`🚀 Running: ${scriptName}`);
  console.log('='.repeat(60));

  try {
    const scriptPath = path.join(SCRIPTS_DIR, scriptName);
    // Build and run the script
    const buildName = scriptName.replace('.ts', '.js');
    execSync(`bun build ${scriptPath} --outdir /tmp --target node && node /tmp/${buildName}`, {
      stdio: 'inherit',
      cwd: process.cwd(),
    });
  } catch (error) {
    console.error(`\n❌ Error running ${scriptName}`);
    process.exit(1);
  }
}

/**
 * Main orchestration function
 */
function main() {
  console.log('\n🎯 Starting All Transforms\n');

  const transforms = [
    'transform-blog.ts',
    'transform-linkedin.ts',
    'transform-twitter.ts',
    'transform-substack.ts',
  ];

  for (const transform of transforms) {
    runTransform(transform);
  }

  console.log('\n' + '='.repeat(60));
  console.log('✅ All transforms completed successfully!');
  console.log('='.repeat(60) + '\n');
}

// Run orchestration
main();
