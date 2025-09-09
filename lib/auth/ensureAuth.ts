import { DeviceCodeAuth, TokenManager } from "@yotoplay/oauth-device-code-flow";
import { logger } from "../utils/logger.js";
import { simpleOpen } from "../utils/simpleOpen.js";
import path from "path";
import os from "os";

// Initialize the authentication system
const tokenPath = path.join(os.homedir(), '.twine2yoto', 'tokens.json');
const tokenManager = new TokenManager(tokenPath);

const authConfig = {
  domain: process.env.YOTO_AUTH_DOMAIN || 'auth.yoto.com',
  clientId: process.env.YOTO_CLIENT_ID!,
  audience: process.env.YOTO_API_URL || 'https://api.yoto.com'
};

const deviceCodeAuth = new DeviceCodeAuth(authConfig);

async function deviceCodeFlow(): Promise<string> {
  if (!process.env.YOTO_CLIENT_ID) {
    throw new Error("YOTO_CLIENT_ID is not set");
  }

  logger.info("Starting device code flow");
  
  const scope = "openid profile email offline_access content:write media:write";
  const deviceCodeResult = await deviceCodeAuth.initiate(scope);
  
  if (!deviceCodeResult.success || !deviceCodeResult.deviceCode) {
    throw new Error(`Failed to initiate device code flow: ${deviceCodeResult.error}`);
  }

  const { deviceCode, verificationUriComplete, expiresIn, interval } = deviceCodeResult;

  // Display instructions to user
  logger.info("Opening browser for authentication...");
  await simpleOpen(verificationUriComplete!);
  logger.info("If the browser did not open automatically, please visit:");
  logger.info(verificationUriComplete!);
  logger.info(
    `This code will expire in ${Math.floor(expiresIn! / 60)} minutes`,
  );
  logger.info("Waiting for authentication...");

  // Poll for completion
  const pollingResult = await deviceCodeAuth.pollForToken(deviceCode, interval!, expiresIn! * 1000);
  
  if (!pollingResult.success || !pollingResult.tokens) {
    throw new Error(`Device code flow failed: ${pollingResult.error}`);
  }

  logger.success("Authentication successful!");
  logger.info("Access token:", pollingResult.tokens.accessToken);
  
  // Save tokens using the new token manager
  await tokenManager.saveTokens(pollingResult.tokens);
  
  return pollingResult.tokens.accessToken;
}

async function refreshTokenFlow(refreshToken: string): Promise<string> {
  const authResult = await deviceCodeAuth.refreshToken(refreshToken);
  
  if (!authResult.success || !authResult.tokens) {
    throw new Error(`Token refresh failed: ${authResult.success ? 'Unknown error' : 'Authentication failed'}`);
  }

  // Save the new tokens
  await tokenManager.saveTokens(authResult.tokens);
  
  return authResult.tokens.accessToken;
}

export async function ensureAuth(): Promise<string> {
  if (!process.env.YOTO_CLIENT_ID) {
    throw new Error("YOTO_CLIENT_ID is not set");
  }

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