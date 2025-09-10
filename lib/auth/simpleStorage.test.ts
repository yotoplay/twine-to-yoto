import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import fs from "fs";
import path from "path";
import {
  loadConfig,
  saveConfig,
  getElevenLabsApiKey,
  setElevenLabsApiKey,
  clearConfig,
} from "./simpleStorage.js";

// Mock fs module
vi.mock("fs");

// Mock os module
vi.mock("os", async (importOriginal) => {
  const actual = await importOriginal<typeof import("os")>();
  return {
    ...actual,
    homedir: vi.fn(() => "/home/user"),
  };
});

const mockFs = vi.mocked(fs);

describe("simpleStorage", () => {
  const mockConfigPath = "/Users/gregsochanik/.twine2yoto/config.json";
  const mockConfigDir = "/Users/gregsochanik/.twine2yoto";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("loadConfig", () => {
    it("should return empty config when file does not exist", async () => {
      mockFs.existsSync.mockReturnValue(false);

      const result = await loadConfig();

      expect(result).toEqual({});
      expect(mockFs.existsSync).toHaveBeenCalledWith(expect.stringContaining(".twine2yoto/config.json"));
    });

    it("should return parsed config when file exists", async () => {
      const mockConfig = { elevenLabsApiKey: "test-key" };
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(JSON.stringify(mockConfig));

      const result = await loadConfig();

      expect(result).toEqual(mockConfig);
      expect(mockFs.readFileSync).toHaveBeenCalledWith(expect.stringContaining(".twine2yoto/config.json"), "utf8");
    });

    it("should return empty config when file is corrupted", async () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue("invalid json");

      const result = await loadConfig();

      expect(result).toEqual({});
    });
  });

  describe("saveConfig", () => {
    it("should create directory and save config", async () => {
      const mockConfig = { elevenLabsApiKey: "test-key" };
      mockFs.existsSync.mockReturnValue(false);

      await saveConfig(mockConfig);

      expect(mockFs.mkdirSync).toHaveBeenCalledWith(expect.stringContaining(".twine2yoto"), { recursive: true });
      expect(mockFs.writeFileSync).toHaveBeenCalledWith(
        expect.stringContaining(".twine2yoto/config.json"),
        JSON.stringify(mockConfig, null, 2)
      );
    });

    it("should save config when directory already exists", async () => {
      const mockConfig = { elevenLabsApiKey: "test-key" };
      mockFs.existsSync.mockReturnValue(true);

      await saveConfig(mockConfig);

      expect(mockFs.mkdirSync).not.toHaveBeenCalled();
      expect(mockFs.writeFileSync).toHaveBeenCalledWith(
        expect.stringContaining(".twine2yoto/config.json"),
        JSON.stringify(mockConfig, null, 2)
      );
    });

    it("should throw error when save fails", async () => {
      const mockConfig = { elevenLabsApiKey: "test-key" };
      mockFs.existsSync.mockReturnValue(false);
      mockFs.writeFileSync.mockImplementation(() => {
        throw new Error("Write failed");
      });

      await expect(saveConfig(mockConfig)).rejects.toThrow("Failed to save configuration: Error: Write failed");
    });
  });

  describe("getElevenLabsApiKey", () => {
    it("should return stored API key", async () => {
      const mockConfig = { elevenLabsApiKey: "test-key" };
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(JSON.stringify(mockConfig));

      const result = await getElevenLabsApiKey();

      expect(result).toBe("test-key");
    });

    it("should return undefined when no key is stored", async () => {
      mockFs.existsSync.mockReturnValue(false);

      const result = await getElevenLabsApiKey();

      expect(result).toBeUndefined();
    });
  });

  describe("setElevenLabsApiKey", () => {
    it("should save API key to config", async () => {
      const apiKey = "new-test-key";
      mockFs.existsSync.mockReturnValue(false);
      mockFs.writeFileSync.mockImplementation(() => {}); // Mock to not throw

      await setElevenLabsApiKey(apiKey);

      expect(mockFs.writeFileSync).toHaveBeenCalledWith(
        expect.stringContaining(".twine2yoto/config.json"),
        JSON.stringify({ elevenLabsApiKey: apiKey }, null, 2)
      );
    });

    it("should preserve existing config when setting API key", async () => {
      const existingConfig = { someOtherKey: "value" };
      const apiKey = "new-test-key";
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(JSON.stringify(existingConfig));
      mockFs.writeFileSync.mockImplementation(() => {}); // Mock to not throw

      await setElevenLabsApiKey(apiKey);

      expect(mockFs.writeFileSync).toHaveBeenCalledWith(
        expect.stringContaining(".twine2yoto/config.json"),
        JSON.stringify({ ...existingConfig, elevenLabsApiKey: apiKey }, null, 2)
      );
    });
  });

  describe("clearConfig", () => {
    it("should delete config file when it exists", async () => {
      mockFs.existsSync.mockReturnValue(true);

      await clearConfig();

      expect(mockFs.unlinkSync).toHaveBeenCalledWith(expect.stringContaining(".twine2yoto/config.json"));
    });

    it("should not throw error when file does not exist", async () => {
      mockFs.existsSync.mockReturnValue(false);

      await expect(clearConfig()).resolves.not.toThrow();
      expect(mockFs.unlinkSync).not.toHaveBeenCalled();
    });
  });
});
