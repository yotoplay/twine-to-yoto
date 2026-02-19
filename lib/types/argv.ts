import { TranscodePreset } from "./transcode.js";

export interface Argv {
  _: (string | number)[];
  input: string;
  output?: string;
  type: string;
  force?: boolean;
  upload: boolean;
  cardid?: string;
  useTags: boolean;
  auto: boolean;
  clearAuth: boolean;
  preset?: TranscodePreset;
}
