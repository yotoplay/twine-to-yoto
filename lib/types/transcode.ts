export interface TranscodedInfo {
  duration: number;
  codec?: string;
  format: string;
  sampleRate?: number;
  channels?: string;
  bitrate?: number;
  metadata?: unknown;
  fileSize: number;
}

export interface TranscodeResponse {
  uploadId?: string;
  uploadFilename?: string;
  uploadSha256?: string;
  transcodedAt?: string;
  transcodedInfo?: TranscodedInfo;
  transcodedSha256?: string;
}

export const TRANSCODE_PRESETS = [
  "auto",
  "music",
  "music_compressed",
  "mixed_compressed",
  "speech_compressed",
  "longform_compressed",
  "compression_minimal",
  "compression_low",
  "compression_medium",
  "compression_high",
  "compression_maximum",
] as const;

export type TranscodePreset = (typeof TRANSCODE_PRESETS)[number];
