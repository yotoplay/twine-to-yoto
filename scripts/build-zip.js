#!/usr/bin/env node
import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const platform = process.argv[2]; // 'mac' or 'win'
const version = process.argv[3]; // version from package.json

if (!platform || !version) {
  console.error("Usage: node scripts/build-zip.js <platform> <version>");
  process.exit(1);
}

const binaryName = platform === "mac" ? "twine2yoto" : "twine2yoto.exe";
const zipName = `twine2yoto-${platform}-${version}.zip`;

// Create artifacts directory if it doesn't exist
if (!fs.existsSync("artifacts")) {
  fs.mkdirSync("artifacts");
}

// Create temp directory
const tempDir = "artifacts/temp";
if (fs.existsSync(tempDir)) {
  fs.rmSync(tempDir, { recursive: true });
}
fs.mkdirSync(tempDir);

try {
  // Copy only the files we want to include
  const filesToInclude = [binaryName, "docs.md", "example.env"];
  const dirsToInclude = ["sample_twees"];

  // Copy files
  filesToInclude.forEach((file) => {
    if (fs.existsSync(file)) {
      fs.copyFileSync(file, path.join(tempDir, file));
    } else {
      console.warn(`Warning: ${file} not found, skipping...`);
    }
  });

  // Copy directories
  dirsToInclude.forEach((dir) => {
    if (fs.existsSync(dir)) {
      // Use cp command for recursive directory copying
      execSync(`cp -r "${dir}" "${path.join(tempDir, dir)}"`, {
        stdio: "inherit",
      });
    } else {
      console.warn(`Warning: ${dir} directory not found, skipping...`);
    }
  });

  // Create zip from temp directory
  const currentDir = process.cwd();
  process.chdir(tempDir);
  execSync(`zip -r ../${zipName} .`, { stdio: "inherit" });
  process.chdir(currentDir);

  console.log(`✅ Created ${zipName} successfully`);
} catch (error) {
  console.error("❌ Error creating zip:", error.message);
  process.exit(1);
} finally {
  // Clean up
  fs.rmSync(tempDir, { recursive: true });
  if (fs.existsSync(binaryName)) {
    fs.unlinkSync(binaryName);
  }
}
