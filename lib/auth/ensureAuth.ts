import { startDeviceCodeFlow, pollDeviceCode, refresh } from "../apis/api.yoto";
import {
  getAccessToken,
  getRefreshToken,
  saveTokens,
  isTokenExpired,
} from "./tokens";
import { logger } from "../utils/logger.js";
import { simpleOpen } from "../utils/simpleOpen.js";

async function deviceCodeFlow() {
  if (!process.env.YOTO_CLIENT_ID) {
    throw new Error("YOTO_CLIENT_ID is not set");
  }

  logger.info("Starting device code flow");
  const { device_code, verification_uri_complete, expires_in, interval } =
    await startDeviceCodeFlow(process.env.YOTO_CLIENT_ID);

  // Display instructions to user
  logger.info("Opening browser for authentication...");
  await simpleOpen(verification_uri_complete);
  logger.info("If the browser did not open automatically, please visit:");
  logger.info(verification_uri_complete);
  logger.info(
    `This code will expire in ${Math.floor(expires_in / 60)} minutes`,
  );
  logger.info("Waiting for authentication...");

  // Poll for completion
  const startTime = Date.now();
  const timeout = expires_in * 1000; // Convert to milliseconds

  while (Date.now() - startTime < timeout) {
    try {
      const { access_token, refresh_token } = await pollDeviceCode(
        device_code,
        process.env.YOTO_CLIENT_ID,
      );
      logger.success("Authentication successful!");
      logger.info("Access token:", access_token);
      saveTokens(access_token, refresh_token);
      return access_token;
    } catch (error: any) {
      if (error.response?.data?.error === "authorization_pending") {
        // Wait for the specified interval before trying again
        await new Promise((resolve) => setTimeout(resolve, interval * 1000));
        continue;
      }
      if (error.response?.data?.error === "expired_token") {
        throw new Error("Device code has expired. Please try again.");
      }
      throw error;
    }
  }

  throw new Error("Device code flow timed out");
}

async function refreshTokenFlow(refreshToken: string) {
  const { access_token, refresh_token } = await refresh({
    refresh_token: refreshToken,
    client_id: process.env.YOTO_CLIENT_ID,
  });
  logger.info("Access token from refresh:", access_token);
  saveTokens(access_token, refresh_token);
  return access_token;
}

export async function ensureAuth() {
  if (!process.env.YOTO_CLIENT_ID) {
    throw new Error("YOTO_CLIENT_ID is not set");
  }

  // Try stored access token first
  const storedToken = getAccessToken();
  if (storedToken && !isTokenExpired(storedToken)) {
    return storedToken;
  }

  // Try refresh token
  const refreshToken = getRefreshToken();
  if (refreshToken) {
    try {
      return await refreshTokenFlow(refreshToken);
    } catch (error) {
      logger.error("Failed to refresh token:", error);
    }
  }

  logger.info("No valid token found, starting device code flow");
  return deviceCodeFlow();
}
