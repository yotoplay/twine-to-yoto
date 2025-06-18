import fs from 'fs';
import path from 'path';
import { InputConfig, OutputConfig } from '../types/file';
import { logger } from './logger.js';

async function ensureDirectoryExists(dir: string) {
    try {
        await fs.promises.mkdir(dir, { recursive: true });
    } catch (error) {
        console.error(`Error creating directory ${dir}`, error);
    }
}

async function emptyDirectory(dir: string) {
    const files = await fs.promises.readdir(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = await fs.promises.stat(filePath);
        if (stat.isDirectory()) {
            await emptyDirectory(filePath);
            await fs.promises.rmdir(filePath);
        } else {
            await fs.promises.unlink(filePath);
        }
    }
}

export async function setupInput(inputDir: string): Promise<InputConfig> {
    const audioDir = path.join(inputDir, 'audio');
    const iconDir = path.join(inputDir, 'icons');
    await ensureDirectoryExists(audioDir);
    await ensureDirectoryExists(iconDir);

    return { audioDir, iconDir };
}

export async function setupOutput(
    outputDir: string,
    forceClean: boolean
): Promise<OutputConfig> {
    if (forceClean) {
        logger.warn(`Cleaning output directory ${outputDir}`);
        await emptyDirectory(outputDir);
    }

    const audioDir = path.join(outputDir, 'audio');
    const iconDir = path.join(outputDir, 'icons');
    await ensureDirectoryExists(audioDir);
    await ensureDirectoryExists(iconDir);

    return { outputDir, audioDir, iconDir };
}
