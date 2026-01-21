import { DeviceCodeAuth, TokenManager } from "@yotoplay/oauth-device-code-flow";
import { logger } from "../utils/logger.js";
import { simpleOpen } from "../utils/simpleOpen.js";
import path from "path";
import os from "os";

// Initialize the authentication system
const tokenPath = path.join(os.homedir(), ".twine2yoto", "tokens.json");
const tokenManager = new TokenManager(tokenPath);

// Hardcoded client ID for twine-to-yoto tool
const YOTO_CLIENT_ID = "8cFQjtbWIUaqSRXLdsDiQ7cuP5EGFKub";

const authConfig = {
  domain: "login.yotoplay.com",
  clientId: YOTO_CLIENT_ID,
  audience: "https://api.yotoplay.com",
};

const deviceCodeAuth = new DeviceCodeAuth(authConfig);

async function deviceCodeFlow(): Promise<string> {
  logger.info("Starting device code flow");

  const scope = "openid offline_access user:content:manage";
  const deviceCodeResult = await deviceCodeAuth.initiate(scope);

  if (!deviceCodeResult.success || !deviceCodeResult.deviceCode) {
    throw new Error(
      `Failed to initiate device code flow: ${deviceCodeResult.error}`,
    );
  }

  const { deviceCode, verificationUriComplete, expiresIn, interval } =
    deviceCodeResult;

  logger.info("Opening browser for authentication...");
  await simpleOpen(verificationUriComplete!);
  logger.info("If the browser did not open automatically, please visit:");
  logger.info(verificationUriComplete!);
  logger.info(
    `This code will expire in ${Math.floor(expiresIn! / 60)} minutes`,
  );
  logger.info("Waiting for authentication...");

  const pollingResult = await deviceCodeAuth.pollForToken(
    deviceCode,
    interval!,
    expiresIn! * 1000,
  );

  if (!pollingResult.success || !pollingResult.tokens) {
    throw new Error(`Device code flow failed: ${pollingResult.error}`);
  }

  logger.success("Authentication successful!");
  logger.info("Access token:", pollingResult.tokens.accessToken);

  await tokenManager.saveTokens(pollingResult.tokens);

  return pollingResult.tokens.accessToken;
}

async function refreshTokenFlow(refreshToken: string): Promise<string> {
  const authResult = await deviceCodeAuth.refreshToken(refreshToken);

  if (!authResult.success || !authResult.tokens) {
    throw new Error(
      `Token refresh failed: ${authResult.success ? "Unknown error" : "Authentication failed"}`,
    );
  }

  // Save the new tokens
  await tokenManager.saveTokens(authResult.tokens);

  return authResult.tokens.accessToken;
}

export async function ensureAuth(): Promise<string> {
  // Try stored access token first
  const storedTokens = await tokenManager.loadTokens();
  if (storedTokens && tokenManager.areTokensValid(storedTokens)) {
    return storedTokens.accessToken;
  }

  // Try refresh token
  if (storedTokens?.refreshToken) {
    try {
      return await refreshTokenFlow(storedTokens.refreshToken);
    } catch (error) {
      logger.error("Failed to refresh token:", error);
    }
  }

  logger.info("No valid token found, starting device code flow");
  return deviceCodeFlow();
}
