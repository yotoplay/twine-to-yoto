import fs from "fs";
import path from "path";

export function readFilesFromDirectory(
  directoryPath: string,
  extension: string,
) {
  if (!fs.existsSync(directoryPath)) {
    console.error(`Directory ${directoryPath} does not exist`);
    process.exit(1);
  }

  const files = fs
    .readdirSync(directoryPath)
    .filter((file) => file.endsWith(extension));
  return files.map((file) => ({
    name: file.split(".")[0],
    path: path.join(directoryPath, file),
  }));
}

export function readFileContent(filePath: string): string {
  return fs.readFileSync(filePath, "utf8");
}
