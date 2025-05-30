// Constants

const { FILE_SYSTEM_SEPARATOR, TEMP_FOLDER_NAME } = require('./Constant.helper.js')

// Errors

const DownloadFail = require('../error/DownloadFail.error.js')
const BadFormat = require('../error/BadFormat.error.js')
const { INPUT_INCORRECTLY_FORMATTED } = require('../error/Constant.error.js')

// Helpers

const Downloader = require('./Downloader.helper.js')

// Libraries

const { exec } = require('node:child_process')
const fs = require('fs')

/**
 * @overview This class represents a downloader.
 */
class DownloaderGit extends Downloader {
  /**
   * Instantiates a downloader.
   */
  constructor() {
    super()
  }

  /**
   * Downloads a list.
   * @param list {[String]} The given list.
   * @param destination {String} The destination.
   * @returns {Promise} A promise for the downloading.
   */
  downloadByList(list, destination) {
    return new Promise((resolveAll, rejectAll) => {
      if (list !== undefined && list !== null && list.length !== 0) {
        let promises = []
        list.forEach((element) => {
          promises.push(
            new Promise((resolve, reject) => {
              this.downloadByElement(element, destination)
                .then((result) => {
                  resolve(result)
                })
                .catch((error) => {
                  reject(error)
                })
            })
          )
        })
        Promise.all(promises)
          .then((resultsAll) => {
            resolveAll(resultsAll)
          })
          .catch((errorAll) => {
            rejectAll(errorAll)
          })
      } else {
        rejectAll(new BadFormat(INPUT_INCORRECTLY_FORMATTED))
      }
    })
  }

  /**
   * Downloads an element.
   * @param element {String} The given element.
   * @param destination {String} The destination.
   * @returns {Promise} A promise for the downloading.
   */
  downloadByElement(element, destination) {
    return new Promise((resolve, reject) => {
      if (element !== undefined && element !== null && element.length > 0) {
        try {
          const url = element
          const urlParts = url.split('/tree/')
          if (urlParts.length === 2) {
            const repositoryUrl = urlParts[0]
            const repositoryParts = repositoryUrl.split('/')
            const repositoryName = repositoryParts.pop()
            const repositoryUser = repositoryParts.pop()
            const hash = urlParts[1]
            const folderName = repositoryUser + '__' + repositoryName + '__' + hash
            exec(
              `git -C ${process.cwd()}${FILE_SYSTEM_SEPARATOR}${TEMP_FOLDER_NAME}${FILE_SYSTEM_SEPARATOR}${destination}${FILE_SYSTEM_SEPARATOR} -c credential.helper= -c core.longpaths=true clone ${repositoryUrl}.git ${folderName}`,
              (cloneError) => {
                if (cloneError) {
                  reject(new DownloadFail(cloneError.message))
                } else {
                  exec(
                    `git -C ${process.cwd()}${FILE_SYSTEM_SEPARATOR}${TEMP_FOLDER_NAME}${FILE_SYSTEM_SEPARATOR}${destination}${FILE_SYSTEM_SEPARATOR}${folderName} checkout ${hash}`,
                    (checkoutError) => {
                      if (checkoutError) {
                        reject(new DownloadFail(checkoutError.message))
                      } else {
                        const denimFilePath = `${process.cwd()}${FILE_SYSTEM_SEPARATOR}${TEMP_FOLDER_NAME}${FILE_SYSTEM_SEPARATOR}${destination}${FILE_SYSTEM_SEPARATOR}${folderName}${FILE_SYSTEM_SEPARATOR}denim`
                        fs.writeFile(denimFilePath, url, (writeError) => {
                          if (writeError) {
                            reject(new DownloadFail(writeError.message))
                          } else {
                            resolve(folderName)
                          }
                        })
                      }
                    }
                  )
                }
              }
            )
          } else {
            reject(new BadFormat(INPUT_INCORRECTLY_FORMATTED))
          }
        } catch (error) {
          reject(new DownloadFail(error.message))
        }
      } else {
        reject(new BadFormat(INPUT_INCORRECTLY_FORMATTED))
      }
    })
  }
}

module.exports = DownloaderGit
