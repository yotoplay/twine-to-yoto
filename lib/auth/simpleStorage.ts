import fs from "fs";
import path from "path";
import os from "os";

const STORE_NAME = "twine2json";
const CONFIG_DIR = path.join(os.homedir(), ".config", STORE_NAME);
const CONFIG_FILE = path.join(CONFIG_DIR, "config.json");

function ensureConfigDir() {
  if (!fs.existsSync(CONFIG_DIR)) {
    fs.mkdirSync(CONFIG_DIR, { recursive: true });
  }
}

function readConfig() {
  try {
    ensureConfigDir();
    if (fs.existsSync(CONFIG_FILE)) {
      const data = fs.readFileSync(CONFIG_FILE, "utf8");
      return JSON.parse(data);
    }
  } catch (error) {
    // If there's any error reading the config, start fresh
  }
  return {};
}

function writeConfig(config: Record<string, any>) {
  try {
    ensureConfigDir();
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
  } catch (error) {
    console.error("Failed to write config:", error);
  }
}

export class SimpleConfigStore {
  private config: Record<string, any>;

  constructor(storeName: string) {
    this.config = readConfig();
  }

  get(key: string) {
    return this.config[key];
  }

  set(key: string, value: any) {
    this.config[key] = value;
    writeConfig(this.config);
  }

  delete(key: string) {
    delete this.config[key];
    writeConfig(this.config);
  }
}
