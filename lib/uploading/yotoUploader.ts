import {
  getTranscodedUpload,
  getUploadUrlForTranscode,
  updateCard,
  uploadFile,
  uploadIcon,
} from "../apis/api.yoto.js";
import fs from "fs";
import path from "path";
import { logger } from "../utils/logger.js";
import { YotoJSON } from "@yotoplay/twee2yoto";
import { TranscodePreset } from "../types/transcode.js";

export async function uploadIconsToYotoCloud(
  accessToken: string,
  iconDir: string,
  yotoJson: YotoJSON,
) {
  const allowedExtensions = [".png", ".gif"];
  const iconFiles = fs.readdirSync(iconDir).filter((file) => {
    const ext = path.extname(file).toLowerCase();
    return allowedExtensions.includes(ext);
  });

  const uploadPromises = iconFiles.map(async (file) => {
    const fileKey = file.split(".")[0];
    const fileExtension = file.split(".")[1];
    const fileContent = fs.readFileSync(path.join(iconDir, file));
    try {
      const response = await uploadIcon(
        accessToken,
        fileContent,
        fileExtension === "gif" ? "image/gif" : "image/png",
      );
      const foundChapter = yotoJson.content.chapters.find(
        (chapter: { key: string }) => chapter.key === fileKey,
      );
      if (!foundChapter) {
        logger.warn(`Chapter not found for icon ${file}`);
        return null;
      }
      foundChapter.display.icon16x16 = `yoto:#${response.displayIcon.mediaId}`;
      return response.displayIcon.mediaId;
    } catch (error) {
      logger.error(`Error uploading icon ${file}: ${error}`);
      throw error;
    }
  });
  return Promise.all(uploadPromises);
}

export interface UploadAudioOptions {
  preset?: TranscodePreset;
  loudnorm?: string;
}

export async function uploadAudioToYotoCloud(
  accessToken: string,
  audioDir: string,
  yotoJson: YotoJSON,
  options?: UploadAudioOptions,
) {
  const audioFiles = fs.readdirSync(audioDir);
  const uploadPromises = audioFiles.map(async (file) => {
    const fileContent = fs.readFileSync(path.join(audioDir, file));
    const { uploadId, uploadUrl } = await getUploadUrlForTranscode(
      accessToken,
      file,
      "audio",
    );
    if (uploadUrl) {
      await uploadFile(uploadUrl, fileContent);
    }
    let transcode = null;
    let counter = 0;
    while (!transcode?.transcodedSha256) {
      const response = await getTranscodedUpload(accessToken, uploadId, {
        preset: options?.preset,
        loudnorm: options?.loudnorm,
      });
      if (response?.transcodedSha256) {
        transcode = response;
        logger.info("Transcode complete", transcode.transcodedSha256, transcode.transcodedInfo?.format);
      } else {
        if (counter > 10) {
          throw new Error(`Transcoding failed for ${file}`);
        }
        logger.pending(`Waiting for transcoding to complete...`);
        counter++;
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }
    }
    const transcodedSha256 = transcode.transcodedSha256;
    const trackFormat = transcode.transcodedInfo?.format;
    if (!trackFormat) {
      throw new Error(`Transcoded format not found for ${file}; transcoded info: ${JSON.stringify(transcode.transcodedInfo)}`);
    }
    yotoJson.content.chapters.forEach((chapter: { tracks: any[] }) => {
      chapter.tracks.forEach((track) => {
        if (track.trackUrl === `yoto:#${file}`) {
          track.trackUrl = `yoto:#${transcodedSha256}`;
          track.format = trackFormat;
        }
      });
    });
    return `yoto:#${transcodedSha256}`;
  });
  return Promise.all(uploadPromises);
}

export async function uploadYotoCardToCloud(
  accessToken: string,
  yotoJson: any,
  cardId?: string,
) {
  if (cardId) yotoJson.cardId = cardId;
  const response = await updateCard(accessToken, yotoJson);
  return response.cardId;
}
