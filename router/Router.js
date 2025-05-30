// Imports

const express = require('express')
const Controller = require('../controller/Controller.controller.js')
const BadFormat = require('../error/BadFormat.error.js')
const ArchiveFail = require('../error/ArchiveFail.error.js')
const DownloadFail = require('../error/DownloadFail.error.js')
const CleaningFail = require('../error/CleaningFail.error.js')
const { BAD_FORMAT } = require('../error/Constant.error')
const { FILE_SYSTEM_SEPARATOR, TEMP_FOLDER_NAME } = require('../helper/Constant.helper')
const fs = require('fs')
const crypto = require('crypto')

// Configuration

const router = express.Router()
const controller = new Controller()

router.post('/git', function (request, response) {
  let requestBody = request.body
  if (
    requestBody !== undefined &&
    requestBody !== null &&
    requestBody.length !== 0 &&
    JSON.stringify(requestBody) !== JSON.stringify({}) &&
    JSON.stringify(requestBody) !== JSON.stringify([])
  ) {
    const destinationDirectory = crypto.randomUUID()
    fs.mkdirSync(
      `${process.cwd()}${FILE_SYSTEM_SEPARATOR}${TEMP_FOLDER_NAME}${FILE_SYSTEM_SEPARATOR}${destinationDirectory}${FILE_SYSTEM_SEPARATOR}`
    ) // Unique directory for distinguishing the requests from different users.
    controller
      .downloadGit(request.body, destinationDirectory)
      .then((result) => {
        response.status(200)
        let zipFilePath = result
        let zipFileName = result.substring(result.lastIndexOf(FILE_SYSTEM_SEPARATOR) + 1)
        response.download(zipFilePath, zipFileName, (downloadError) => {
          if (downloadError) {
            response.status(500).json({ name: 'DownloadFail', message: downloadError.message })
            controller.clean(destinationDirectory)
          }
        })
        response.on('finish', () => {
          controller.clean(destinationDirectory)
        })
      })
      .catch((error) => {
        switch (true) {
          case error instanceof BadFormat:
            response.status(406)
            break
          case error instanceof DownloadFail:
            response.status(404)
            break
          case error instanceof ArchiveFail:
            response.status(500)
            break
          case error instanceof CleaningFail:
            response.status(500)
            break
          default:
            response.status(500)
            break
        }
        response.json({ name: error.name, message: error.message })
      })
  } else {
    response.status(406)
    response.json({ name: BAD_FORMAT, message: '' })
  }
})

module.exports = router
