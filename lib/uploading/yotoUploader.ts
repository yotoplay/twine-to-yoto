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

export async function uploadIconsToYotoCloud(
  accessToken: string,
  iconDir: string,
  yotoJson: any,
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

export async function uploadAudioToYotoCloud(
  accessToken: string,
  audioDir: string,
  yotoJson: any,
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
    let transcodedSha256 = null;
    let counter = 0;
    while (!transcodedSha256) {
      const transcode = await getTranscodedUpload(accessToken, uploadId);
      if (transcode?.transcodedSha256) {
        transcodedSha256 = transcode.transcodedSha256;
      } else {
        if (counter > 10) {
          throw new Error(`Transcoding failed for ${file}`);
        }
        logger.pending(`Waiting for transcoding to complete...`);
        counter++;
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }
    }
    yotoJson.content.chapters.forEach((chapter: { tracks: any[] }) => {
      chapter.tracks.forEach((track) => {
        if (track.trackUrl === `yoto:#${file}`)
          track.trackUrl = `yoto:#${transcodedSha256}`;
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
