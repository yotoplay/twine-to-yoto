import { SimpleConfigStore } from "./simpleStorage.js";
import jwt from "jsonwebtoken";

const storageSettings = {
  STORE_NAME: "twine2json",
  AUTH_TOKEN: "authToken",
  REFRESH_TOKEN: "refreshToken",
};

function getConfig() {
  return new SimpleConfigStore(storageSettings.STORE_NAME);
}

export function isTokenExpired(token: string) {
  const decoded = jwt.decode(token) as jwt.JwtPayload;
  if (!decoded || !decoded.exp) {
    return true;
  }

  const currentTime = Math.floor(Date.now() / 1000);
  return decoded.exp < currentTime;
}

export function getAccessToken() {
  const config = getConfig();
  const token = config.get(storageSettings.AUTH_TOKEN);
  return token && !isTokenExpired(token) ? token : null;
}

export function getRefreshToken() {
  const config = getConfig();
  return config.get(storageSettings.REFRESH_TOKEN);
}

export function saveTokens(accessToken: string, refreshToken?: string) {
  const config = getConfig();
  config.set(storageSettings.AUTH_TOKEN, accessToken);
  if (refreshToken) {
    config.set(storageSettings.REFRESH_TOKEN, refreshToken);
  }
}

export function clearAuthConfig() {
  const config = getConfig();
  config.delete(storageSettings.AUTH_TOKEN);
  config.delete(storageSettings.REFRESH_TOKEN);
}
