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

// Create artifacts directory if it doesn't exist
if (!fs.existsSync("artifacts")) {
    fs.mkdirSync("artifacts");
}

// Helper function to create zip for a specific binary
function createZipForBinary(binaryName, zipName, tempDir) {
    // Create temp directory
    if (fs.existsSync(tempDir)) {
        fs.rmSync(tempDir, { recursive: true });
    }
    fs.mkdirSync(tempDir);

    try {
        // Copy the binary and rename it
        fs.copyFileSync(binaryName, path.join(tempDir, "twine2yoto"));

        // Copy other files
        const filesToInclude = ["DOCS.md", "example.env"];
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
        console.error(`❌ Error creating ${zipName}:`, error.message);
        throw error;
    } finally {
        // Clean up temp directory
        fs.rmSync(tempDir, { recursive: true });
    }
}

try {
    if (platform === "mac") {
        // For macOS, create separate zips for ARM64 and x64
        const arm64Binary = "twine2yoto-arm64";
        const x64Binary = "twine2yoto-x64";

        if (fs.existsSync(arm64Binary)) {
            createZipForBinary(arm64Binary, `twine2yoto-macos-arm64-${version}.zip`, "artifacts/temp-arm64");
        }

        if (fs.existsSync(x64Binary)) {
            createZipForBinary(x64Binary, `twine2yoto-macos-x64-${version}.zip`, "artifacts/temp-x64");
        }

        if (!fs.existsSync(arm64Binary) && !fs.existsSync(x64Binary)) {
            throw new Error("No macOS binaries found");
        }
    } else {
        // For Windows, use the .exe file
        const binaryName = "twine2yoto.exe";
        if (fs.existsSync(binaryName)) {
            createZipForBinary(binaryName, `twine2yoto-${platform}-${version}.zip`, "artifacts/temp-win");
        } else {
            console.warn(`Warning: ${binaryName} not found, skipping...`);
        }
    }
} catch (error) {
    console.error("❌ Error creating zip:", error.message);
    process.exit(1);
} finally {
    // Clean up binaries
    ["twine2yoto", "twine2yoto.exe", "twine2yoto-arm64", "twine2yoto-x64"].forEach(binary => {
        if (fs.existsSync(binary)) {
            fs.unlinkSync(binary);
        }
    });
}
