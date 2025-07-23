import axios from "axios";
import axiosRetry from "axios-retry";
import qs from "qs";
import { YotoJSON } from "@yotoplay/twee2yoto";
import { jwtDecode as decode } from "jwt-decode";
import { AuthCredentials } from "../types/auth";
import axiosDebug from "./axiosDebug.js";
import { logger } from "../utils/logger";

const YOTO_API_URL = "https://api.yotoplay.com";
const YOTO_AUTH_URL = "https://login.yotoplay.com";
export const client = axios.create();
axiosDebug(client);
axiosRetry(client, { retries: 5, retryDelay: axiosRetry.exponentialDelay });
client.defaults.headers.common["User-Agent"] = `twine2yoto`;

export async function startDeviceCodeFlow(client_id: string) {
  try {
    const response = await client.post(
      `${YOTO_AUTH_URL}/oauth/device/code`,
      qs.stringify({
        client_id,
        scope: "openid profile email offline_access content:write media:write",
        audience: YOTO_API_URL,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      },
    );
    logger.info("Device code flow response", response.data);
    return response.data;
  } catch (error) {
    logger.error("Device code flow error", error);
    throw error;
  }
}

export async function pollDeviceCode(device_code: string, client_id: string) {
  try {
    const response = await client.post(
      `${YOTO_AUTH_URL}/oauth/token`,
      qs.stringify({
        grant_type: "urn:ietf:params:oauth:grant-type:device_code",
        device_code,
        client_id,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      },
    );
    logger.info("Poll device code response:", response.data);
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.error === "authorization_pending") {
      throw { response: { data: { error: "authorization_pending" } } };
    }
    throw error;
  }
}

export async function refresh({ refresh_token, client_id }: AuthCredentials) {
  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
  };

  const data = qs.stringify({
    grant_type: "refresh_token",
    refresh_token,
    client_id,
  });

  const response = await client.post(`${YOTO_API_URL}/auth/token`, data, {
    headers,
  });
  return response.data;
}

export function getProfile(id_token: string) {
  try {
    return decode(id_token);
  } catch (err) {
    return null;
  }
}

export async function getUploadUrlForTranscode(
  access_token: string,
  sha256: string,
  filename: string,
) {
  const url = `${YOTO_API_URL}/media/transcode/audio/uploadUrl?sha256=${sha256}`;
  const response = await client.get(url, {
    headers: { Authorization: `Bearer ${access_token}` },
    params: { filename },
  });
  return response.data.upload;
}

export async function uploadFile(url: string, fileContent: Buffer) {
  if (!url) {
    throw new Error("No upload URL provided");
  }
  return client.put(url, fileContent, {
    headers: {
      "Content-Type": "audio/mpeg",
    },
  });
}

export async function updateCard(access_token: string, card: YotoJSON) {
  const url = `${YOTO_API_URL}/content?skipMediaFileCheck=true`;

  const response = await client.post(url, card, {
    headers: { Authorization: `Bearer ${access_token}` },
  });

  return response.data.card;
}

export async function getTranscodedUpload(
  access_token: string,
  uploadId: string,
) {
  const url = `${YOTO_API_URL}/media/upload/${uploadId}/transcoded?loudnorm=false`;
  const response = await client.get(url, {
    headers: { Authorization: `Bearer ${access_token}` },
  });

  return response.data.transcode;
}

export async function uploadIcon(
  access_token: string,
  iconFile: Buffer,
  mimetype: string,
) {
  const autoConvert = mimetype === "image/png";
  const url = `${YOTO_API_URL}/media/displayIcons/user/me/upload?autoConvert=${autoConvert}`;

  const response = await client.post(url, iconFile, {
    headers: {
      "Content-Type": mimetype,
      Authorization: `Bearer ${access_token}`,
    },
  });

  return response.data;
}
