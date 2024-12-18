// Libraries

const archiver = require('archiver');
const fs = require('fs');

// Helpers

const Archiver = require('./Archiver.helper.js');

// Constants

const {FILE_SYSTEM_SEPARATOR, TEMP_FOLDER_NAME} = require("./Constant.helper");

// Error

const BadFormat = require("../error/BadFormat.error");
const ArchiveFail = require("../error/ArchiveFail.error");
const {FILES_MISSING, INPUT_INCORRECTLY_FORMATTED} = require('../error/Constant.error.js');

/**
 * @overview This class represents an archiver.
 */
class ArchiverZip extends Archiver {

    /**
     * Instantiates an archiver.
     */
    constructor() {
        super();
    }

    /**
     * Archive a list of file.
     * @param list {[String]} The given list of files.
     * @returns {Promise} A promise for the archiving.
     */
    archiveByList(list) {
        return new Promise((resolve, reject) => {
            if (list !== undefined
                && list !== null
                && list.length !== 0) {

                if (list.every(directory => fs.existsSync(`${process.cwd()}${FILE_SYSTEM_SEPARATOR}${TEMP_FOLDER_NAME}${FILE_SYSTEM_SEPARATOR}${directory}`))) {

                    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
                    const zipName = `${timestamp}.zip`;
                    const zipPath = `${process.cwd()}${FILE_SYSTEM_SEPARATOR}${TEMP_FOLDER_NAME}${FILE_SYSTEM_SEPARATOR}${zipName}`;
                    const output = fs.createWriteStream(zipPath);
                    const archive = archiver('zip', {
                        zlib: {level: 9} // 9 = maximal compression.
                    });

                    output.on('close', function () {
                        resolve(zipPath)
                    });

                    archive.on('error', function (error) {
                        reject(new ArchiveFail(error.message))
                    });

                    archive.pipe(output);

                    list.forEach((directory) => {
                        let path = `${process.cwd()}${FILE_SYSTEM_SEPARATOR}${TEMP_FOLDER_NAME}${FILE_SYSTEM_SEPARATOR}${directory}`;
                        if (fs.existsSync(path)
                            && fs.lstatSync(path).isDirectory()) {
                            archive.directory(path, directory);
                        }
                    });
                    archive.finalize();
                } else {
                    reject(new ArchiveFail(FILES_MISSING));
                }
            } else {
                reject(new BadFormat(INPUT_INCORRECTLY_FORMATTED));
            }
        });
    }
}

module.exports = ArchiverZip;