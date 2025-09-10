import fs from "fs";
import path from "path";
import os from "os";

interface StoredConfig {
  elevenLabsApiKey?: string;
}

const configPath = path.join(os.homedir(), ".twine2yoto", "config.json");

export async function loadConfig(): Promise<StoredConfig> {
  try {
    if (fs.existsSync(configPath)) {
      const data = fs.readFileSync(configPath, "utf8");
      return JSON.parse(data);
    }
  } catch (error) {
    // If file doesn't exist or is corrupted, return empty config
  }
  return {};
}

export async function saveConfig(config: StoredConfig): Promise<void> {
  try {
    // Ensure directory exists
    const configDir = path.dirname(configPath);
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true });
    }
    
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  } catch (error) {
    throw new Error(`Failed to save configuration: ${error}`);
  }
}

export async function getElevenLabsApiKey(): Promise<string | undefined> {
  const config = await loadConfig();
  return config.elevenLabsApiKey;
}

export async function setElevenLabsApiKey(apiKey: string): Promise<void> {
  const config = await loadConfig();
  config.elevenLabsApiKey = apiKey;
  await saveConfig(config);
}

export async function clearConfig(): Promise<void> {
  try {
    if (fs.existsSync(configPath)) {
      fs.unlinkSync(configPath);
    }
  } catch (error) {
    // Ignore errors when clearing
  }
}
