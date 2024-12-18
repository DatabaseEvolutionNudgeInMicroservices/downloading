// Helpers

const DownloaderGit = require('../helper/DownloaderGit.helper.js');
const ArchiverZip = require('../helper/ArchiverZip.helper.js');
const CleanerFile = require('../helper/CleanerFile.helper.js');

// Errors

const BadFormat = require('../error/BadFormat.error.js');

/**
 * @overview This class represents the controller.
 */
class Controller {

    /**
     * Instantiates a controller.
     */
    constructor() {
        this.downloaderGit = new DownloaderGit();
        this.archiverZip = new ArchiverZip();
        this.cleanerFile = new CleanerFile();
    }

    /**
     * Cleans the all TEMP directory.
     * @returns {Promise} A promise for the cleaning.
     */
    clean() {
        return this.cleanerFile.cleanAll();
    }

    /**
     * Downloads git repositories.
     * @param repositoryList {[String]} A list of repositories to download.
     * @returns {Promise} A promise for the downloading.
     */
    downloadGit(repositoryList) {
        return new Promise((resolve, reject) => {
            if (repositoryList !== undefined
                && repositoryList !== null
                && repositoryList.length !== 0) {
                try {
                    this.downloaderGit.downloadByList(repositoryList).then((result) => {
                        this.archiverZip.archiveByList(result).then((result) => {
                            resolve(result)
                        })
                    }).catch(error => {
                        this.clean().then(() => {
                            reject(error);
                        });
                    });
                } catch (error) {
                    this.clean().then(() => {
                        reject(error);
                    });
                }
            } else {
                this.clean().then(() => {
                    reject(new BadFormat());
                });
            }
        });
    }
}

module.exports = Controller;