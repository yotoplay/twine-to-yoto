const fs = require("fs");
const path = require("path");

const version = fs.readFileSync("../version.txt", "utf-8").trim();
const arm64Url = fs.readFileSync("../arm64_url.txt", "utf-8").trim();
const arm64Sha = fs.readFileSync("../arm64_sha.txt", "utf-8").trim();
const x64Url = fs.readFileSync("../x64_url.txt", "utf-8").trim();
const x64Sha = fs.readFileSync("../x64_sha.txt", "utf-8").trim();

const templatePath = path.join(__dirname, "template.rb");
const outputPath = path.join(__dirname, "../twine-to-yoto.rb");

let template = fs.readFileSync(templatePath, "utf-8");

const formula = template
  .replace("{{VERSION}}", version)
  .replace("{{ARM64_URL}}", arm64Url)
  .replace("{{ARM64_SHA}}", arm64Sha)
  .replace("{{X64_URL}}", x64Url)
  .replace("{{X64_SHA}}", x64Sha);

fs.writeFileSync(outputPath, formula);
console.log("✅ Generated twine-to-yoto.rb");