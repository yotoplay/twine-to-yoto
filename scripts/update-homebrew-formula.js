#!/usr/bin/env node

import { createHash } from 'crypto';
import { readFileSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';

const version = process.argv[2];
const zipPath = process.argv[3];

if (!version || !zipPath) {
    console.error('Usage: node scripts/update-homebrew-formula.js <version> <zip-path>');
    console.error('Example: node scripts/update-homebrew-formula.js 1.9.0 ./twine2yoto-macos-arm64-v1.9.0.zip');
    process.exit(1);
}

// Calculate SHA256
const fileBuffer = readFileSync(zipPath);
const hashSum = createHash('sha256');
hashSum.update(fileBuffer);
const sha256 = hashSum.digest('hex');

console.log(`Version: ${version}`);
console.log(`SHA256: ${sha256}`);

// Update the formula
const formulaPath = '../homebrew-tap/Formula/twine-to-yoto.rb';
const formulaContent = readFileSync(formulaPath, 'utf8');

const updatedContent = formulaContent
    .replace(/version "[\d.]+"/, `version "${version}"`)
    .replace(/url "https:\/\/github\.com\/yotoplay\/twine-to-yoto\/releases\/download\/v[\d.]+/g, `url "https://github.com/yotoplay/twine-to-yoto/releases/download/v${version}`)
    .replace(/sha256 "PLACEHOLDER_SHA256"/g, `sha256 "${sha256}"`);

writeFileSync(formulaPath, updatedContent);

console.log(`✅ Updated ${formulaPath}`);
console.log('\nNext steps:');
console.log('1. cd ../homebrew-tap');
console.log('2. git add Formula/twine-to-yoto.rb');
console.log('3. git commit -m "feat: update twine-to-yoto to v' + version + '"');
console.log('4. git push origin main'); 