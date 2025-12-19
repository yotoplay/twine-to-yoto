import axios from "axios";
import axiosDebug from "./axiosDebug.js";
import axiosRetry from "axios-retry";
import { getElevenLabsApiKeyIfAvailable } from "../auth/elevenLabsAuth.js";

export const client = axios.create();
axiosDebug(client);
axiosRetry(client, { retries: 5, retryDelay: axiosRetry.exponentialDelay });

const ELEVENLABS_API_URL = "https://api.elevenlabs.io/v1";

export async function textToSpeech(text: string, voiceId: string) {
  const apiKey = await getElevenLabsApiKeyIfAvailable();

  if (!apiKey) {
    throw new Error(
      "ElevenLabs API key not available - audio generation is disabled",
    );
  }

  const response = await client.post(
    `${ELEVENLABS_API_URL}/text-to-speech/${voiceId}?output_format=mp3_44100_64&enable_logging=true`,
    {
      text,
      model_id: "eleven_v3",
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
