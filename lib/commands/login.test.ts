import { describe, it, expect, vi, beforeEach } from "vitest";
import { handleLogin } from "./login.js";

const mockEnsureAuth = vi.fn();

vi.mock("../auth/ensureAuth.js", () => ({
  ensureAuth: (...args: unknown[]) => mockEnsureAuth(...args),
}));

const mockLogger = {
  success: vi.fn(),
  error: vi.fn(),
  info: vi.fn(),
};

vi.mock("../utils/logger.js", () => ({
  logger: {
    success: (...args: unknown[]) => mockLogger.success(...args),
    error: (...args: unknown[]) => mockLogger.error(...args),
    info: (...args: unknown[]) => mockLogger.info(...args),
  },
}));

describe("handleLogin", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls ensureAuth and logs success", async () => {
    mockEnsureAuth.mockResolvedValue("test-access-token");

    await handleLogin();

    expect(mockEnsureAuth).toHaveBeenCalledOnce();
    expect(mockLogger.success).toHaveBeenCalledWith(
      expect.stringContaining("authenticated"),
    );
  });

  it("logs an error when authentication fails", async () => {
    mockEnsureAuth.mockRejectedValue(new Error("Auth failed"));

    await handleLogin();

    expect(mockEnsureAuth).toHaveBeenCalledOnce();
    expect(mockLogger.error).toHaveBeenCalled();
  });

  it("does not throw when authentication fails", async () => {
    mockEnsureAuth.mockRejectedValue(new Error("Auth failed"));

    await expect(handleLogin()).resolves.toBeUndefined();
  });
});
