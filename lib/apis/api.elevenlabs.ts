import axios from "axios";
import axiosDebug from "./axiosDebug.js";
import axiosRetry from "axios-retry";
import { ensureElevenLabsApiKey } from "../auth/elevenLabsAuth.js";

export const client = axios.create();
axiosDebug(client);
axiosRetry(client, { retries: 5, retryDelay: axiosRetry.exponentialDelay });

const ELEVENLABS_API_URL = "https://api.elevenlabs.io/v1";

export async function textToSpeech(text: string, voiceId: string) {
  const apiKey = await ensureElevenLabsApiKey();
  
  const response = await client.post(
    `${ELEVENLABS_API_URL}/text-to-speech/${voiceId}?output_format=mp3_44100_64&enable_logging=true`,
    {
      text,
    },
    {
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": apiKey,
      },
      responseType: "arraybuffer",
    },
  );
  return { data: response.data };
}
