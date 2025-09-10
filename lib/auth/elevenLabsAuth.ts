import readline from "readline";
import { logger } from "../utils/logger.js";
import { getElevenLabsApiKey, setElevenLabsApiKey } from "./simpleStorage.js";

function promptForApiKey(): Promise<string> {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    logger.info("ElevenLabs API key is required for audio generation.");
    logger.info(
      "You can get your API key from: https://elevenlabs.io/app/settings/api-keys",
    );

    rl.question("Please enter your ElevenLabs API key: ", (apiKey) => {
      rl.close();
      resolve(apiKey.trim());
    });
  });
}

export async function ensureElevenLabsApiKey(): Promise<string> {
  // Try to get stored API key first
  const storedApiKey = await getElevenLabsApiKey();
  if (storedApiKey) {
    return storedApiKey;
  }

  // Prompt user for API key
  const apiKey = await promptForApiKey();

  if (!apiKey) {
    throw new Error("ElevenLabs API key is required for audio generation");
  }

  // Save the API key for future use
  await setElevenLabsApiKey(apiKey);
  logger.success("ElevenLabs API key saved for future use");

  return apiKey;
}
