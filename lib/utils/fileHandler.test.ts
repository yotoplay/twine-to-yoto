import { readFilesFromDirectory, readFileContent } from './fileHandler.js';

describe('fileHandler', () => {
    describe('readFilesFromDirectory', () => {
        it('should return an array of file paths with the specified extension', () => {
            const directoryPath = '__tests__/data';
            const extension = 'png';

            const result = readFilesFromDirectory(directoryPath, extension);

            expect(result).toEqual([
                { name: 'image', path: '__tests__/data/image.png' }
            ]);
        });

        it('should return an empty array if no files with the specified extension are found', () => {
            const directoryPath = '__tests__/data';
            const extension = '.csv';

            const result = readFilesFromDirectory(directoryPath, extension);

            expect(result).toEqual([]);
        });
    });

    describe('readFileContent', () => {
        it('should return the content of the file as a string', () => {
            const filePath = '__tests__/data/test.txt';

            const result = readFileContent(filePath);

            expect(result).toEqual('File content');
        });
    });
});
