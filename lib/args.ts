import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { Argv } from "./types/argv";
import { TRANSCODE_PRESETS } from "./types/transcode.js";

export const argv = yargs(hideBin(process.argv))
  .option("input", {
    alias: "i",
    type: "string",
    requiresArg: true,
    description: "Input directory path - must contain at least a *.twee file",
  })
  .option("type", {
    alias: "t",
    type: "string",
    description: "Output type (twee or yoto)",
    default: "yoto",
  })
  .option("output", {
    alias: "o",
    type: "string",
    description: "Output directory",
  })
  .option("force", {
    alias: "f",
    type: "boolean",
    description: "force empty the output directory",
    default: false,
  })
  .option("upload", {
    alias: "u",
    type: "boolean",
    description: "uploads the content to YotoCloud; requires a token parameter",
    default: false,
  })
  .option("cardid", {
    alias: "c",
    type: "string",
    description:
      "a card id that the content will be uploaded to, if not supplied a new card will be generated",
  })
  .option("useTags", {
    alias: "ut",
    type: "boolean",
    description: "Append twee passage tags to chapter keys",
    default: true,
  })
  .option("auto", {
    alias: "a",
    type: "boolean",
    description:
      "Enable automatic audio generation via ElevenLabs for passages without provided audio",
    default: false,
  })
  .option("clearAuth", {
    type: "boolean",
    description: "Clear stored authentication configuration",
    default: false,
  })
  .option("preset", {
    alias: "p",
    type: "string",
    choices: [...TRANSCODE_PRESETS],
    description:
      "Transcode preset (e.g. music for AAC, auto for auto-detect)",
  })
  .help()
  .alias("help", "h").argv as Argv;
