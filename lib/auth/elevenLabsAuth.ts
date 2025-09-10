import readline from "readline";
import { logger } from "../utils/logger.js";
import { getElevenLabsApiKey, setElevenLabsApiKey } from "./simpleStorage.js";

function promptForApiKey(): Promise<string | null> {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    logger.info("ElevenLabs API key is optional but enables automatic audio generation.");
    logger.info(
      "You can get your API key from: https://elevenlabs.io/app/settings/api-keys",
    );

    rl.question("Please enter your ElevenLabs API key (or press Enter to skip): ", (apiKey) => {
      rl.close();
      const trimmedKey = apiKey.trim();
      resolve(trimmedKey || null);
    });
  });
}

export async function setupElevenLabsApiKey(): Promise<void> {
  // Check if we already have a stored API key
  const storedApiKey = await getElevenLabsApiKey();
  if (storedApiKey) {
    logger.info("ElevenLabs API key found - audio generation enabled");
    return;
  }

  // Prompt user for API key
  const apiKey = await promptForApiKey();

  if (apiKey) {
    // Save the API key for future use
    await setElevenLabsApiKey(apiKey);
    logger.success("ElevenLabs API key saved - audio generation enabled");
  } else {
    logger.info("No ElevenLabs API key provided - audio generation will be skipped");
  }
}

export async function getElevenLabsApiKeyIfAvailable(): Promise<string | null> {
  const apiKey = await getElevenLabsApiKey();
  return apiKey || null;
}
