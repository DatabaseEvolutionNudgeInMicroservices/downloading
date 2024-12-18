// Helpers

const DownloaderGit = require('../../helper/DownloaderGit.helper.js');

// Libraries

const fs = require('fs');

// Constants

const {FILE_SYSTEM_SEPARATOR, TEMP_FOLDER_NAME} = require('../../helper/Constant.helper');

// Errors

const DownloadFail = require('../../error/DownloadFail.error.js');
const BadFormat = require('../../error/BadFormat.error.js');

// Setup

const repositoryList = ['https://github.com/overleaf/document-updater/tree/b9011d28a698d9310d2c4b7d9b85f925ae23c865', 'https://github.com/overleaf/document-updater/tree/aa30da573b3f091e8d3c22805c7f0a5a794a999a', 'https://github.com/overleaf/docstore/tree/32b4e942977fde88ddf9b2be2aa06236e89be66e'];
const downloadedDirectoryList = ['overleaf__document-updater__b9011d28a698d9310d2c4b7d9b85f925ae23c865', 'overleaf__document-updater__aa30da573b3f091e8d3c22805c7f0a5a794a999a', 'overleaf__docstore__32b4e942977fde88ddf9b2be2aa06236e89be66e'];

// Happy path test suite

describe('Git downloader', () => {

    afterEach(async () => {
        // Cleaning.
        const tempPath = `${process.cwd()}${FILE_SYSTEM_SEPARATOR}${TEMP_FOLDER_NAME}`;
        if (fs.existsSync(tempPath)) {
            const files = fs.readdirSync(tempPath);
            for (const file of files) {
                const fullPath = tempPath + FILE_SYSTEM_SEPARATOR + file;
                if (fs.statSync(fullPath).isDirectory()) {
                    fs.rmdirSync(fullPath, {recursive: true});
                } else {
                    fs.unlinkSync(fullPath);
                }
            }
        }
    });

    it('downloads a repository', async () => {

        // Given

        let downloaderGit = new DownloaderGit();

        // When Then

        await downloaderGit.downloadByElement(repositoryList[0]).then((result) => {
            const repositoryCloned = fs.existsSync(`${process.cwd()}${FILE_SYSTEM_SEPARATOR}${TEMP_FOLDER_NAME}${FILE_SYSTEM_SEPARATOR}${downloadedDirectoryList[0]}`);
            const denimFileCreated = fs.existsSync(`${process.cwd()}${FILE_SYSTEM_SEPARATOR}${TEMP_FOLDER_NAME}${FILE_SYSTEM_SEPARATOR}${downloadedDirectoryList[0]}${FILE_SYSTEM_SEPARATOR}denim`);
            const returnedDownloadedRepositoryEqualsToGivenRepository = result === downloadedDirectoryList[0];
            expect(repositoryCloned && denimFileCreated && returnedDownloadedRepositoryEqualsToGivenRepository).toBe(true);
        });
    });

    it('downloads a repository list', async () => {

        // Given

        let downloaderGit = new DownloaderGit();

        // When Then

        await downloaderGit.downloadByList(repositoryList).then(async (result) => {
            const repositoryCloned1 = fs.existsSync(`${process.cwd()}${FILE_SYSTEM_SEPARATOR}${TEMP_FOLDER_NAME}${FILE_SYSTEM_SEPARATOR}${downloadedDirectoryList[0]}`);
            let returnedDownloadedRepositoriesListEqualsToGivenRepositoriesList = (JSON.stringify(result) === JSON.stringify(downloadedDirectoryList));
            expect(repositoryCloned1 && returnedDownloadedRepositoriesListEqualsToGivenRepositoriesList).toBe(true);
        });
    });
});

// Failure cases test suite

describe('Git downloader tries to', () => {

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

    it('download an undefined git repository', async () => {

        // Given

        let downloaderGit = new DownloaderGit();
        let gitRepository = undefined;

        // When Then

        await expect(downloaderGit.downloadByElement(gitRepository)).rejects.toThrow(BadFormat);

    });

    it('download a null git repository', async () => {

        // Given

        let downloaderGit = new DownloaderGit();
        let gitRepository = null;

        // When Then

        await expect(downloaderGit.downloadByElement(gitRepository)).rejects.toThrow(BadFormat);

    });

    it('download a repository without URL', async () => {

        // Given

        let downloaderGit = new DownloaderGit();
        let gitRepository = "";

        // When Then

        await expect(downloaderGit.downloadByElement(gitRepository)).rejects.toThrow(BadFormat);

    });

    it('download a not found git repository', async () => {

        // Given

        let downloaderGit = new DownloaderGit();
        let gitRepository = 'https://github.com/unknown/unknown/tree/aaa';

        // When Then

        await expect(downloaderGit.downloadByElement(gitRepository)).rejects.toThrow(DownloadFail);
    });

    it('download a git repository without hash', async () => {

        // Given

        let gitRepositoryList = 'https://github.com/overleaf/document-updater/';
        let downloaderGit = new DownloaderGit();

        // When Then

        await expect(downloaderGit.downloadByElement(gitRepositoryList)).rejects.toThrow(BadFormat);
    });

    it('download a git repository with not found hash', async () => {

        // Given

        let gitRepositoryList = 'https://github.com/overleaf/document-updater/tree/aaa';
        let downloaderGit = new DownloaderGit();

        // When Then

        await expect(downloaderGit.downloadByElement(gitRepositoryList)).rejects.toThrow(DownloadFail);
    });

    it('download an undefined git repository list', async () => {

        // Given

        let gitRepositoryList = undefined;
        let downloaderGit = new DownloaderGit();

        // When Then

        await expect(downloaderGit.downloadByList(gitRepositoryList)).rejects.toThrow(BadFormat);
    });

    it('download a null git repository list', async () => {

        // Given

        let gitRepositoryList = null;
        let downloaderGit = new DownloaderGit();

        // When Then

        await expect(downloaderGit.downloadByList(gitRepositoryList)).rejects.toThrow(BadFormat);
    });

    it('download an empty git repository list', async () => {

        // Given

        let gitRepositoryList = [];
        let downloaderGit = new DownloaderGit();

        // When Then

        await expect(downloaderGit.downloadByList(gitRepositoryList)).rejects.toThrow(BadFormat);
    });

    it('download a git repository list with undefined repositories', async () => {

        // Given

        let gitRepositoryList = [undefined];
        let downloaderGit = new DownloaderGit();

        // When Then

        await expect(downloaderGit.downloadByList(gitRepositoryList)).rejects.toThrow(BadFormat);
    });

    it('download a git repository list with null repositories', async () => {

        // Given

        let gitRepositoryList = [null];
        let downloaderGit = new DownloaderGit();

        // When Then

        await expect(downloaderGit.downloadByList(gitRepositoryList)).rejects.toThrow(BadFormat);
    });

    it('download a git repository list with empty repositories', async () => {

        // Given

        let gitRepositoryList = [""];
        let downloaderGit = new DownloaderGit();

        // When Then

        await expect(downloaderGit.downloadByList(gitRepositoryList)).rejects.toThrow(BadFormat);
    });

    it('download a git repository list with not found repositories', async () => {

        // Given

        let gitRepositoryList = ['https://github.com/unknown/unknown/tree/aaa'];
        let downloaderGit = new DownloaderGit();

        // When Then

        await expect(downloaderGit.downloadByList(gitRepositoryList)).rejects.toThrow(DownloadFail);
    });

    it('download a git repository list without hash', async () => {

        // Given

        let gitRepositoryList = ['https://github.com/overleaf/document-updater/'];
        let downloaderGit = new DownloaderGit();

        // When Then

        await expect(downloaderGit.downloadByList(gitRepositoryList)).rejects.toThrow(BadFormat);
    });

    it('download a git repository list with not found hash', async () => {

        // Given

        let gitRepositoryList = ['https://github.com/overleaf/document-updater/tree/aaa'];
        let downloaderGit = new DownloaderGit();

        // When Then

        await expect(downloaderGit.downloadByList(gitRepositoryList)).rejects.toThrow(DownloadFail);
    });
});