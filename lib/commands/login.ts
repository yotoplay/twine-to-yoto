import { ensureAuth } from "../auth/ensureAuth.js";
import { logger } from "../utils/logger.js";

export async function handleLogin(): Promise<void> {
  try {
    await ensureAuth();
    logger.success("Successfully authenticated with Yoto");
  } catch (error) {
    logger.error("Authentication failed:", error);
  }
}
