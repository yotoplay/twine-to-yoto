import { TranscodePreset } from "./transcode.js";

export interface Argv {
  input: string;
  output?: string;
  type: string;
  force?: boolean;
  upload: boolean;
  cardid?: string;
  useTags: boolean;
  clearAuth: boolean;
  preset?: TranscodePreset;
}
