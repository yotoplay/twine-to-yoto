import { describe, it, expect, beforeEach, vi } from "vitest";

// Mock the oauth-device-code-flow library
const mockTokenManager = {
  loadTokens: vi.fn(),
  saveTokens: vi.fn(),
  areTokensValid: vi.fn(),
  clearTokens: vi.fn(),
};

const mockDeviceCodeAuth = {
  initiate: vi.fn(),
  pollForToken: vi.fn(),
  refreshToken: vi.fn(),
};

vi.mock("@yotoplay/oauth-device-code-flow", () => ({
  DeviceCodeAuth: vi.fn(() => mockDeviceCodeAuth),
  TokenManager: vi.fn(() => mockTokenManager),
}));

vi.mock("../utils/simpleOpen", () => ({
  simpleOpen: vi.fn(),
}));

vi.mock("path", () => ({
  default: {
    join: vi.fn((...args) => args.join("/")),
  },
  join: vi.fn((...args) => args.join("/")),
}));

vi.mock("os", () => ({
  default: {
    homedir: vi.fn(() => "/home/user"),
  },
  homedir: vi.fn(() => "/home/user"),
}));

describe("ensureAuth", () => {
  const mockAccessToken = "test-access-token";
  const mockRefreshToken = "test-refresh-token";

  const mockStoredTokens = {
    accessToken: mockAccessToken,
    refreshToken: mockRefreshToken,
    expiresAt: Date.now() + 3600000, // 1 hour from now
    tokenType: "Bearer",
  };

  const mockDeviceCodeResult = {
    success: true,
    deviceCode: "test-device-code",
    userCode: "TEST-CODE",
    verificationUri: "https://verify.test",
    verificationUriComplete: "https://verify.test?user_code=TEST-CODE",
    expiresIn: 300,
    interval: 5,
  };

  const mockPollingResult = {
    success: true,
    tokens: {
      accessToken: "new-access-token",
      refreshToken: "new-refresh-token",
      expiresAt: Date.now() + 3600000,
      tokenType: "Bearer",
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Set up environment variables
    process.env.YOTO_CLIENT_ID = "test-client-id";
  });

  it("should use stored access token if valid", async () => {
    mockTokenManager.loadTokens.mockResolvedValue(mockStoredTokens);
    mockTokenManager.areTokensValid.mockReturnValue(true);

    const { ensureAuth } = await import("./ensureAuth.js");
    const result = await ensureAuth();

    expect(result).toBe(mockAccessToken);
    expect(mockTokenManager.loadTokens).toHaveBeenCalled();
    expect(mockTokenManager.areTokensValid).toHaveBeenCalledWith(
      mockStoredTokens,
    );
  });

  it("should use refresh token if access token is invalid", async () => {
    mockTokenManager.loadTokens.mockResolvedValue(mockStoredTokens);
    mockTokenManager.areTokensValid.mockReturnValue(false);
    mockDeviceCodeAuth.refreshToken.mockResolvedValue({
      success: true,
      tokens: {
        accessToken: "new-access-token",
        refreshToken: "new-refresh-token",
        expiresAt: Date.now() + 3600000,
        tokenType: "Bearer",
      },
    });

    const { ensureAuth } = await import("./ensureAuth.js");
    const result = await ensureAuth();

    expect(result).toBe("new-access-token");
    expect(mockDeviceCodeAuth.refreshToken).toHaveBeenCalledWith(
      mockRefreshToken,
    );
    expect(mockTokenManager.saveTokens).toHaveBeenCalled();
  });

  it("should start device code flow if refresh token fails", async () => {
    mockTokenManager.loadTokens.mockResolvedValue(mockStoredTokens);
    mockTokenManager.areTokensValid.mockReturnValue(false);
    mockDeviceCodeAuth.refreshToken.mockRejectedValue(
      new Error("Refresh failed"),
    );
    mockDeviceCodeAuth.initiate.mockResolvedValue(mockDeviceCodeResult);
    mockDeviceCodeAuth.pollForToken.mockResolvedValue(mockPollingResult);

    const { ensureAuth } = await import("./ensureAuth.js");
    const result = await ensureAuth();

    expect(result).toBe("new-access-token");
    expect(mockDeviceCodeAuth.initiate).toHaveBeenCalled();
    expect(mockDeviceCodeAuth.pollForToken).toHaveBeenCalled();
    expect(mockTokenManager.saveTokens).toHaveBeenCalled();
  });

  it("should start device code flow if no valid tokens", async () => {
    mockTokenManager.loadTokens.mockResolvedValue(null);
    mockDeviceCodeAuth.initiate.mockResolvedValue(mockDeviceCodeResult);
    mockDeviceCodeAuth.pollForToken.mockResolvedValue(mockPollingResult);

    const { ensureAuth } = await import("./ensureAuth.js");
    const result = await ensureAuth();

    expect(result).toBe("new-access-token");
    expect(mockDeviceCodeAuth.initiate).toHaveBeenCalled();
    expect(mockDeviceCodeAuth.pollForToken).toHaveBeenCalled();
    expect(mockTokenManager.saveTokens).toHaveBeenCalled();
  });

  it("should handle device code flow initiation failure", async () => {
    mockTokenManager.loadTokens.mockResolvedValue(null);
    mockDeviceCodeAuth.initiate.mockResolvedValue({
      success: false,
      error: "Failed to initiate device code flow",
    });

    const { ensureAuth } = await import("./ensureAuth.js");

    await expect(ensureAuth()).rejects.toThrow(
      "Failed to initiate device code flow",
    );
  });

  it("should handle polling failure", async () => {
    mockTokenManager.loadTokens.mockResolvedValue(null);
    mockDeviceCodeAuth.initiate.mockResolvedValue(mockDeviceCodeResult);
    mockDeviceCodeAuth.pollForToken.mockResolvedValue({
      success: false,
      error: "Device code flow failed",
    });

    const { ensureAuth } = await import("./ensureAuth.js");

    await expect(ensureAuth()).rejects.toThrow("Device code flow failed");
  });
});
