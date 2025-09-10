import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import readline from "readline";
import { ensureElevenLabsApiKey } from "./elevenLabsAuth.js";

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
    
    const { getElevenLabsApiKey, setElevenLabsApiKey } = await import("./simpleStorage.js");
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

  it("should return stored API key if available", async () => {
    const storedApiKey = "stored-api-key";
    mockGetElevenLabsApiKey.mockResolvedValue(storedApiKey);

    const result = await ensureElevenLabsApiKey();

    expect(result).toBe(storedApiKey);
    expect(mockGetElevenLabsApiKey).toHaveBeenCalled();
    expect(mockCreateInterface).not.toHaveBeenCalled();
  });

  it("should prompt user for API key when not stored", async () => {
    const userApiKey = "user-entered-key";
    mockGetElevenLabsApiKey.mockResolvedValue(undefined);
    
    // Mock the question callback
    mockRl.question.mockImplementation((question: string, callback: (answer: string) => void) => {
      callback(userApiKey);
    });

    const result = await ensureElevenLabsApiKey();

    expect(result).toBe(userApiKey);
    expect(mockGetElevenLabsApiKey).toHaveBeenCalled();
    expect(mockCreateInterface).toHaveBeenCalledWith({
      input: process.stdin,
      output: process.stdout,
    });
    expect(mockRl.question).toHaveBeenCalledWith(
      "Please enter your ElevenLabs API key: ",
      expect.any(Function)
    );
    expect(mockSetElevenLabsApiKey).toHaveBeenCalledWith(userApiKey);
    expect(mockRl.close).toHaveBeenCalled();
  });

  it("should throw error when user enters empty API key", async () => {
    mockGetElevenLabsApiKey.mockResolvedValue(undefined);
    
    // Mock the question callback with empty string
    mockRl.question.mockImplementation((question: string, callback: (answer: string) => void) => {
      callback("");
    });

    await expect(ensureElevenLabsApiKey()).rejects.toThrow("ElevenLabs API key is required for audio generation");
    
    expect(mockSetElevenLabsApiKey).not.toHaveBeenCalled();
  });

  it("should trim whitespace from user input", async () => {
    const userApiKey = "  user-entered-key  ";
    const trimmedKey = "user-entered-key";
    mockGetElevenLabsApiKey.mockResolvedValue(undefined);
    
    // Mock the question callback
    mockRl.question.mockImplementation((question: string, callback: (answer: string) => void) => {
      callback(userApiKey);
    });

    const result = await ensureElevenLabsApiKey();

    expect(result).toBe(trimmedKey);
    expect(mockSetElevenLabsApiKey).toHaveBeenCalledWith(trimmedKey);
  });
});
