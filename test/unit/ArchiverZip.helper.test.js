// Helpers

const ArchiverZip = require('../../helper/ArchiverZip.helper.js');

// Libraries

const fs = require('fs');

// Constants

const {FILE_SYSTEM_SEPARATOR, TEMP_FOLDER_NAME} = require('../../helper/Constant.helper');

// Errors

const ArchiveFail = require('../../error/ArchiveFail.error.js');
const BadFormat = require('../../error/BadFormat.error.js');

// Setup

let directories = ['test1', 'test2', 'test3'];
let files = ['file1.txt', 'file2.txt', 'file3.txt'];

// Happy path test suite

describe('Zip archiver', () => {

    beforeEach(() => {
        const tempPath = `${process.cwd()}${FILE_SYSTEM_SEPARATOR}${TEMP_FOLDER_NAME}`;
        directories.forEach((directory) => {
            const directoryPath = `${tempPath}${FILE_SYSTEM_SEPARATOR}${directory}`
            if (!fs.existsSync(directoryPath)) {
                fs.mkdirSync(directoryPath);
            }
            files.forEach((fileName) => {
                const filePath = `${directoryPath}${FILE_SYSTEM_SEPARATOR}${fileName}`;
                fs.writeFileSync(filePath, 'Test');
            });
        });
    });

    afterEach(async () => {
        // Cleaning.
        const tempPath = `${process.cwd()}${FILE_SYSTEM_SEPARATOR}${TEMP_FOLDER_NAME}`;
        if (fs.existsSync(tempPath)) {
            const files = fs.readdirSync(tempPath);
            for (const file of files) {
                const fullPath = `${tempPath}${FILE_SYSTEM_SEPARATOR}${file}`;
                if (fs.statSync(fullPath).isDirectory()) {
                    fs.rmdirSync(fullPath, {recursive: true});
                } else {
                    fs.unlinkSync(fullPath);
                }
            }
        }
    });

    it('zips files', async () => {

        // Given

        let archiverZip = new ArchiverZip();

        // When Then

        await archiverZip.archiveByList(directories).then((result) => {
            const archiveCreated = fs.existsSync(result);
            expect(archiveCreated).toBe(true);
        });
    });
});

// Failure cases test suite

describe('Zip archiver tries to', () => {

    it('zip undefined file list', async () => {

        // Given

        let archiverZip = new ArchiverZip();

        // When Then

        await expect(archiverZip.archiveByList(undefined)).rejects.toThrow(BadFormat);
    });

    it('zip null file list', async () => {

        // Given

        let archiverZip = new ArchiverZip();

        // When Then

        await expect(archiverZip.archiveByList(null)).rejects.toThrow(BadFormat);
    });

    it('zip empty file list', async () => {

        // Given

        let archiverZip = new ArchiverZip();

        // When Then

        await expect(archiverZip.archiveByList([])).rejects.toThrow(BadFormat);
    });


    it('zip file list with unknown files', async () => {

        // Given

        let archiverZip = new ArchiverZip();

        // When Then

        await expect(archiverZip.archiveByList(['unknown'])).rejects.toThrow(ArchiveFail);
    });
});