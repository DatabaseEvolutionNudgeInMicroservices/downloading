// Helpers

const DownloaderGit = require('../helper/DownloaderGit.helper.js')
const ArchiverZip = require('../helper/ArchiverZip.helper.js')
const CleanerFile = require('../helper/CleanerFile.helper.js')

// Errors

const BadFormat = require('../error/BadFormat.error.js')
const { INPUT_INCORRECTLY_FORMATTED } = require('../error/Constant.error')

/**
 * @overview This class represents the controller.
 */
class Controller {
  /**
   * Instantiates a controller.
   */
  constructor() {
    this.downloaderGit = new DownloaderGit()
    this.archiverZip = new ArchiverZip()
    this.cleanerFile = new CleanerFile()
  }

  /**
   * Cleans the destination directory.
   * @param destination {String} The destination directory to clean.
   * @param attempts {Number} The number of attempts in case of failure (e.g., lock on files).
   */
  clean(destination, attempts = 5) {
    this.cleanerFile.cleanByElement(destination).catch(() => {
      let self = this
      if (attempts > 0) {
        let newRetry = attempts - 1
        setTimeout(() => {
          self.clean(destination, newRetry)
        }, 1000)
      }
    })
  }

  /**
   * Downloads git repositories.
   * @param repositoryList {[String]} A list of repositories to download.
   * @param destination {String} The destination.
   * @returns {Promise} A promise for the downloading.
   */
  downloadGit(repositoryList, destination) {
    return new Promise((resolve, reject) => {
      if (repositoryList !== undefined && repositoryList !== null && repositoryList.length !== 0) {
        try {
          this.downloaderGit
            .downloadByList(repositoryList, destination)
            .then((result) => {
              this.archiverZip.archiveByList(result, destination).then((result) => {
                resolve(result)
              })
            })
            .catch((error) => {
              reject(error)
              this.clean(destination)
            })
        } catch (error) {
          reject(error)
          this.clean(destination)
        }
      } else {
        reject(new BadFormat(INPUT_INCORRECTLY_FORMATTED))
        this.clean(destination)
      }
    })
  }
}

module.exports = Controller
