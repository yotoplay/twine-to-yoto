import fs from 'fs';
import { setupOutput } from './consoleHelper.js';

describe('setupOutput', () => {
    const outputDir = '.out/test';
    const audioDir = '.out/test/audio';
    const iconDir = '.out/test/icons';

    it('should create the output directory and subdirectories', async () => {
        const result = await setupOutput(outputDir, false);
        expect(result).toEqual({ outputDir, audioDir, iconDir });
        expect(fs.existsSync(outputDir)).toBe(true);
        expect(fs.existsSync(audioDir)).toBe(true);
        expect(fs.existsSync(iconDir)).toBe(true);
        expect(fs.readdirSync(outputDir)).toEqual(['audio', 'icons']);
    });

    it('should empty the output directory if forceClean is true', async () => {
        const result = await setupOutput(outputDir, true);
        expect(result).toEqual({ outputDir, audioDir, iconDir });
        expect(fs.readdirSync(outputDir)).toEqual(['audio', 'icons']);
    });
});
