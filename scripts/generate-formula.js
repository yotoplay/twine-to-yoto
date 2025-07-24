import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const formulaDir = path.join(__dirname, "../homebrew-tap/Formula");
const version = fs.readFileSync(path.join(formulaDir, "version.txt"), "utf-8").trim();
const arm64Url = fs.readFileSync(path.join(formulaDir, "arm64_url.txt"), "utf-8").trim();
const arm64Sha = fs.readFileSync(path.join(formulaDir, "arm64_sha256.txt"), "utf-8").trim();
const x64Url = fs.readFileSync(path.join(formulaDir, "x64_url.txt"), "utf-8").trim();
const x64Sha = fs.readFileSync(path.join(formulaDir, "x64_sha256.txt"), "utf-8").trim();

const templatePath = path.join(__dirname, "template.rb");
const outputPath = path.join(formulaDir, "twine-to-yoto.rb");

let template = fs.readFileSync(templatePath, "utf-8");

const formula = template
    .replace("{{VERSION}}", version)
    .replace("{{ARM64_URL}}", arm64Url)
    .replace("{{ARM64_SHA}}", arm64Sha)
    .replace("{{X64_URL}}", x64Url)
    .replace("{{X64_SHA}}", x64Sha);

fs.writeFileSync(outputPath, formula);
console.log("✅ Generated twine-to-yoto.rb");