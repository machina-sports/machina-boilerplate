#!/usr/bin/env node

/**
 * Script to prepare boilerplate for production use
 * Removes example files and dependencies from the project
 */

/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, 'boilerplate-config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

const rootDir = path.join(__dirname, '..');
const gitignorePath = path.join(rootDir, '.gitignore');
const packageJsonPath = path.join(rootDir, 'package.json');

// Read current .gitignore
let gitignoreContent = fs.existsSync(gitignorePath) ? fs.readFileSync(gitignorePath, 'utf-8') : '';

// Read package.json
if (!fs.existsSync(packageJsonPath)) {
  console.error('❌ package.json not found!');
  process.exit(1);
}

const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

console.log('🚀 Preparing boilerplate for production...\n');

// Add example files to .gitignore if not already present
const gitignoreEntries = config.exampleFiles.map((file) => {
  // Ensure proper path format
  const normalizedPath = file.startsWith('/') ? file.slice(1) : file;
  return normalizedPath;
});

let updatedGitignore = gitignoreContent;
const separator = '\n# Boilerplate example files (added by prepare:production)\n';
const boilerplateSection = separator + gitignoreEntries.join('\n') + '\n';

if (!gitignoreContent.includes('# Boilerplate example files')) {
  updatedGitignore += boilerplateSection;
  fs.writeFileSync(gitignorePath, updatedGitignore, 'utf-8');
  console.log('✅ Added example files to .gitignore');
} else {
  console.log('ℹ️  Example files already in .gitignore');
}

// Remove example dependencies from package.json
let hasChanges = false;

// Remove from dependencies
config.exampleDependencies.dependencies.forEach((dep) => {
  if (packageJson.dependencies && packageJson.dependencies[dep]) {
    delete packageJson.dependencies[dep];
    hasChanges = true;
    console.log(`✅ Removed dependency: ${dep}`);
  }
});

// Remove from devDependencies
config.exampleDependencies.devDependencies.forEach((dep) => {
  if (packageJson.devDependencies && packageJson.devDependencies[dep]) {
    delete packageJson.devDependencies[dep];
    hasChanges = true;
    console.log(`✅ Removed devDependency: ${dep}`);
  }
});

if (hasChanges) {
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n', 'utf-8');
  console.log('\n✅ Updated package.json');
  console.log('\n⚠️  Run "npm install" to update node_modules');
} else {
  console.log('\nℹ️  No dependency changes needed');
}

console.log('\n✨ Production preparation complete!');
console.log('📝 Example files are now ignored by git');
console.log('💡 To restore examples, run: npm run prepare:development\n');
