import { describe, it, expect, beforeEach, vi } from "vitest";
import { DeviceCodeResponse } from "../types/auth.js";

vi.mock("./tokens");
vi.mock("../apis/api.yoto");
vi.mock("../utils/simpleOpen", () => ({
  simpleOpen: vi.fn(),
}));

describe("ensureAuth", () => {
  const mockAccessToken = "test-access-token";
  const mockRefreshToken = "test-refresh-token";
  const deviceCodeResponse: DeviceCodeResponse = {
    device_code: "test-device-code",
    user_code: "TEST-CODE",
    verification_uri: "https://verify.test",
    verification_uri_complete: "https://verify.test?user_code=TEST-CODE",
    expires_in: 300,
    interval: 5,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should use stored access token if valid", async () => {
    const { getAccessToken, isTokenExpired } = await import("./tokens");
    const { ensureAuth } = await import("./ensureAuth.js");

    vi.mocked(getAccessToken).mockReturnValue(mockAccessToken);
    vi.mocked(isTokenExpired).mockReturnValue(false);

    const result = await ensureAuth();
    expect(result).toBe(mockAccessToken);
  });

  it("should use refresh token if access token is invalid", async () => {
    const { getAccessToken, getRefreshToken, saveTokens, isTokenExpired } =
      await import("./tokens");
    const { refresh } = await import("../apis/api.yoto");
    const { ensureAuth } = await import("./ensureAuth.js");

    const mockAccessToken = "expired-access-token";
    const mockRefreshToken = "valid-refresh-token";
    const newAccessToken = "new-access-token";
    const newRefreshToken = "new-refresh-token";

    vi.mocked(getAccessToken).mockReturnValue(mockAccessToken);
    vi.mocked(isTokenExpired).mockReturnValue(true);
    vi.mocked(getRefreshToken).mockReturnValue(mockRefreshToken);
    vi.mocked(refresh).mockResolvedValue({
      access_token: newAccessToken,
      refresh_token: newRefreshToken,
      expires_in: 3600,
    });

    const result = await ensureAuth();
    expect(result).toBe(newAccessToken);
    expect(refresh).toHaveBeenCalledWith({
      client_id: "test-client-id",
      refresh_token: mockRefreshToken,
    });
    expect(saveTokens).toHaveBeenCalledWith(newAccessToken, newRefreshToken);
  });

  it("should start device code flow if refresh token fails", async () => {
    const { getAccessToken, getRefreshToken, isTokenExpired } = await import(
      "./tokens"
    );
    const { startDeviceCodeFlow, pollDeviceCode, refresh } = await import(
      "../apis/api.yoto"
    );
    const { ensureAuth } = await import("./ensureAuth.js");

    vi.mocked(getAccessToken).mockReturnValue(mockAccessToken);
    vi.mocked(isTokenExpired).mockReturnValue(true);
    vi.mocked(getRefreshToken).mockReturnValue(mockRefreshToken);
    vi.mocked(refresh).mockRejectedValue(new Error("Refresh failed"));
    vi.mocked(startDeviceCodeFlow).mockResolvedValue(deviceCodeResponse);
    vi.mocked(pollDeviceCode).mockResolvedValue({
      access_token: "new-access-token",
      refresh_token: "new-refresh-token",
    });

    const result = await ensureAuth();
    expect(result).toBe("new-access-token");
    expect(startDeviceCodeFlow).toHaveBeenCalled();
    expect(pollDeviceCode).toHaveBeenCalledWith(
      deviceCodeResponse.device_code,
      expect.any(String),
    );
  });

  it("should start device code flow if no valid tokens", async () => {
    const { getAccessToken, getRefreshToken } = await import("./tokens");
    const { startDeviceCodeFlow, pollDeviceCode } = await import(
      "../apis/api.yoto"
    );
    const { ensureAuth } = await import("./ensureAuth.js");

    vi.mocked(getAccessToken).mockReturnValue(undefined);
    vi.mocked(getRefreshToken).mockReturnValue(undefined);
    vi.mocked(startDeviceCodeFlow).mockResolvedValue(deviceCodeResponse);
    vi.mocked(pollDeviceCode).mockResolvedValue({
      access_token: "new-access-token",
      refresh_token: "new-refresh-token",
    });

    const result = await ensureAuth();
    expect(result).toBe("new-access-token");
    expect(startDeviceCodeFlow).toHaveBeenCalled();
    expect(pollDeviceCode).toHaveBeenCalledWith(
      deviceCodeResponse.device_code,
      expect.any(String),
    );
  });

  it("should handle network errors during device code flow", async () => {
    const { getAccessToken, getRefreshToken } = await import("./tokens");
    const { startDeviceCodeFlow, pollDeviceCode } = await import(
      "../apis/api.yoto"
    );
    const { ensureAuth } = await import("./ensureAuth.js");

    vi.mocked(getAccessToken).mockReturnValue(undefined);
    vi.mocked(getRefreshToken).mockReturnValue(undefined);
    vi.mocked(startDeviceCodeFlow).mockResolvedValue(deviceCodeResponse);
    vi.mocked(pollDeviceCode).mockRejectedValue(new Error("Network error"));

    await expect(ensureAuth()).rejects.toThrow("Network error");
  });

  it("should save tokens after successful device code flow", async () => {
    const { getAccessToken, getRefreshToken, saveTokens } = await import(
      "./tokens"
    );
    const { startDeviceCodeFlow, pollDeviceCode } = await import(
      "../apis/api.yoto"
    );
    const { ensureAuth } = await import("./ensureAuth.js");

    vi.mocked(getAccessToken).mockReturnValue(undefined);
    vi.mocked(getRefreshToken).mockReturnValue(undefined);
    vi.mocked(startDeviceCodeFlow).mockResolvedValue(deviceCodeResponse);
    vi.mocked(pollDeviceCode).mockResolvedValue({
      access_token: "new-access-token",
      refresh_token: "new-refresh-token",
    });

    await ensureAuth();
    expect(saveTokens).toHaveBeenCalledWith(
      "new-access-token",
      "new-refresh-token",
    );
  });

  it("should handle network errors during device code flow start", async () => {
    const { getAccessToken, getRefreshToken } = await import("./tokens");
    const { startDeviceCodeFlow } = await import("../apis/api.yoto");
    const { ensureAuth } = await import("./ensureAuth.js");

    vi.mocked(getAccessToken).mockReturnValue(undefined);
    vi.mocked(getRefreshToken).mockReturnValue(undefined);
    vi.mocked(startDeviceCodeFlow).mockRejectedValue(
      new Error("Network error"),
    );

    await expect(ensureAuth()).rejects.toThrow("Network error");
  });
});
