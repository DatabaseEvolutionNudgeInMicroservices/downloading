// Controllers

const Controller = require('../../controller/Controller.controller.js');

// Errors

const DownloadFail = require('../../error/DownloadFail.error.js');
const BadFormat = require('../../error/BadFormat.error.js');

// Libraries

const fs = require('fs');
const {FILE_SYSTEM_SEPARATOR, TEMP_FOLDER_NAME} = require("../../helper/Constant.helper");

// Happy path test suite

describe('Controller', () => {

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

    it('downloads and zips a git repository list', async () => {

        // Given

        let controller = new Controller();
        let gitRepositoryList = ['https://github.com/overleaf/document-updater/tree/b9011d28a698d9310d2c4b7d9b85f925ae23c865', 'https://github.com/overleaf/document-updater/tree/aa30da573b3f091e8d3c22805c7f0a5a794a999a', 'https://github.com/overleaf/docstore/tree/32b4e942977fde88ddf9b2be2aa06236e89be66e'];

        // When Then

        await controller.downloadGit(gitRepositoryList).then((result) => {
            const repositoryCloned = fs.existsSync(`${result}`);
            expect(repositoryCloned).toBe(true);
        });
    });
});

// Failure cases test suite

describe('Controller tries to', () => {

    it('download and zip an undefined repository list', async () => {

        // Given

        let controller = new Controller();

        // When Then

        await expect(controller.downloadGit(undefined)).rejects.toThrow(BadFormat);
    });

    it('download and zip a null repository list', async () => {

        // Given

        let controller = new Controller();

        // When Then

        await expect(controller.downloadGit(null)).rejects.toThrow(BadFormat);
    });

    it('download and zip an empty repository list', async () => {

        // Given

        let controller = new Controller();

        // When Then

        await expect(controller.downloadGit([])).rejects.toThrow(BadFormat);
    });

    it('download and zip a repository list with undefined repositories', async () => {

        // Given

        let controller = new Controller();

        // When Then

        await expect(controller.downloadGit([undefined])).rejects.toThrow(BadFormat);
    });

    it('download and zip a repository list with null repositories', async () => {

        // Given

        let controller = new Controller();

        // When Then

        await expect(controller.downloadGit([null])).rejects.toThrow(BadFormat);
    });

    it('download and zip a repository list with empty repositories', async () => {

        // Given

        let controller = new Controller();

        // When Then

        await expect(controller.downloadGit([""])).rejects.toThrow(BadFormat);
    });

    it('download and zip a git repository list with not found repositories', async () => {

        // Given

        let gitRepositoryList = ['https://github.com/unknown/unknown/tree/aaa'];
        let controller = new Controller();

        // When Then

        await expect(controller.downloadGit(gitRepositoryList)).rejects.toThrow(DownloadFail);
    });

    it('download and zip a git repository list without hash', async () => {

        // Given

        let gitRepositoryList = ['https://github.com/overleaf/document-updater/'];
        let controller = new Controller();

        // When Then

        await expect(controller.downloadGit(gitRepositoryList)).rejects.toThrow(BadFormat);
    });

    it('download and zip a git repository list with not found hash', async () => {

        // Given

        let gitRepositoryList = ['https://github.com/overleaf/document-updater/tree/aaa'];
        let controller = new Controller();

        // When Then

        await expect(controller.downloadGit(gitRepositoryList)).rejects.toThrow(DownloadFail);
    });
});