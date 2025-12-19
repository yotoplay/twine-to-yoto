import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import readline from "readline";
import {
  setupElevenLabsApiKey,
  getElevenLabsApiKeyIfAvailable,
} from "./elevenLabsAuth.js";

// Mock readline
vi.mock("readline");

// Mock simpleStorage
vi.mock("./simpleStorage.js", () => ({
  getElevenLabsApiKey: vi.fn(),
  setElevenLabsApiKey: vi.fn(),
}));

// Mock logger
vi.mock("../utils/logger.js", () => ({
  logger: {
    info: vi.fn(),
    success: vi.fn(),
  },
}));

describe("elevenLabsAuth", () => {
  let mockGetElevenLabsApiKey: any;
  let mockSetElevenLabsApiKey: any;
  let mockCreateInterface: any;
  let mockRl: any;

  beforeEach(async () => {
    vi.clearAllMocks();

    const { getElevenLabsApiKey, setElevenLabsApiKey } = await import(
      "./simpleStorage.js"
    );
    mockGetElevenLabsApiKey = getElevenLabsApiKey;
    mockSetElevenLabsApiKey = setElevenLabsApiKey;

    // Mock readline interface
    mockRl = {
      question: vi.fn(),
      close: vi.fn(),
    };

    mockCreateInterface = vi.mocked(readline.createInterface);
    mockCreateInterface.mockReturnValue(mockRl);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("setupElevenLabsApiKey", () => {
    it("should not prompt if API key is already stored", async () => {
      const storedApiKey = "stored-api-key";
      mockGetElevenLabsApiKey.mockResolvedValue(storedApiKey);

      await setupElevenLabsApiKey();

      expect(mockGetElevenLabsApiKey).toHaveBeenCalled();
      expect(mockCreateInterface).not.toHaveBeenCalled();
    });

    it("should prompt user for API key when not stored", async () => {
      const userApiKey = "user-entered-key";
      mockGetElevenLabsApiKey.mockResolvedValue(undefined);

      // Mock the question callback
      mockRl.question.mockImplementation(
        (question: string, callback: (answer: string) => void) => {
          callback(userApiKey);
        },
      );

      await setupElevenLabsApiKey();

      expect(mockGetElevenLabsApiKey).toHaveBeenCalled();
      expect(mockCreateInterface).toHaveBeenCalledWith({
        input: process.stdin,
        output: process.stdout,
      });
      expect(mockRl.question).toHaveBeenCalledWith(
        "Please enter your ElevenLabs API key (or press Enter to skip): ",
        expect.any(Function),
      );
      expect(mockSetElevenLabsApiKey).toHaveBeenCalledWith(userApiKey);
      expect(mockRl.close).toHaveBeenCalled();
    });

    it("should handle empty API key gracefully", async () => {
      mockGetElevenLabsApiKey.mockResolvedValue(undefined);

      // Mock the question callback with empty string
      mockRl.question.mockImplementation(
        (question: string, callback: (answer: string) => void) => {
          callback("");
        },
      );

      await setupElevenLabsApiKey();

      expect(mockSetElevenLabsApiKey).not.toHaveBeenCalled();
    });

    it("should trim whitespace from user input", async () => {
      const userApiKey = "  user-entered-key  ";
      const trimmedKey = "user-entered-key";
      mockGetElevenLabsApiKey.mockResolvedValue(undefined);

      // Mock the question callback
      mockRl.question.mockImplementation(
        (question: string, callback: (answer: string) => void) => {
          callback(userApiKey);
        },
      );

      await setupElevenLabsApiKey();

      expect(mockSetElevenLabsApiKey).toHaveBeenCalledWith(trimmedKey);
    });
  });

  describe("getElevenLabsApiKeyIfAvailable", () => {
    it("should return stored API key if available", async () => {
      const storedApiKey = "stored-api-key";
      mockGetElevenLabsApiKey.mockResolvedValue(storedApiKey);

      const result = await getElevenLabsApiKeyIfAvailable();

      expect(result).toBe(storedApiKey);
      expect(mockGetElevenLabsApiKey).toHaveBeenCalled();
    });

    it("should return null if no API key is stored", async () => {
      mockGetElevenLabsApiKey.mockResolvedValue(null);

      const result = await getElevenLabsApiKeyIfAvailable();

      expect(result).toBeNull();
      expect(mockGetElevenLabsApiKey).toHaveBeenCalled();
    });
  });
});
