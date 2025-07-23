import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function simpleOpen(url: string): Promise<void> {
  const platform = process.platform;

  try {
    if (platform === "darwin") {
      // macOS
      await execAsync(`open "${url}"`);
    } else if (platform === "win32") {
      // Windows
      await execAsync(`start "${url}"`);
    } else {
      // Linux and other Unix-like systems
      await execAsync(`xdg-open "${url}"`);
    }
  } catch (error) {
    console.error(`Failed to open URL: ${url}`, error);
    // Don't throw - just log the error and continue
  }
}
