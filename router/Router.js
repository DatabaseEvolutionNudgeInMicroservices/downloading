// Imports

const express = require('express');
const Controller = require('../controller/Controller.controller.js');
const BadFormat = require('../error/BadFormat.error.js');
const ArchiveFail = require('../error/ArchiveFail.error.js');
const DownloadFail = require('../error/DownloadFail.error.js');
const CleaningFail = require('../error/CleaningFail.error.js');
const {BAD_FORMAT} = require('../error/Constant.error');
const {FILE_SYSTEM_SEPARATOR} = require("../helper/Constant.helper");

// Configuration

const router = express.Router();
const controller = new Controller();

router.post('/git', function (request, response) {
    let requestBody = request.body;
    if (requestBody !== undefined
        && requestBody !== null
        && requestBody.length !== 0
        && JSON.stringify(requestBody) !== JSON.stringify({})
        && JSON.stringify(requestBody) !== JSON.stringify([])) {
        controller.downloadGit(request.body)
            .then((result) => {
                response.status(200);
                let zipFilePath = result;
                let zipFileName = result.substring(result.lastIndexOf(FILE_SYSTEM_SEPARATOR) + 1);
                response.download(zipFilePath, zipFileName, async (downloadError) => {
                    if (downloadError) {
                        response.status(500).json({name: DownloadFail.name, message: downloadError.message});
                    } else {
                        await controller.clean();
                    }
                });
            })
            .catch((error) => {
                switch (true) {
                    case error instanceof BadFormat:
                        response.status(406);
                        break;
                    case error instanceof DownloadFail:
                        response.status(404);
                        break;
                    case error instanceof ArchiveFail:
                        response.status(500);
                        break;
                    case error instanceof CleaningFail:
                        response.status(500);
                        break;
                    default:
                        response.status(500);
                        break;
                }
                response.json({name: error.name, message: error.message});
            });
    } else {
        response.status(406);
        response.json({name: BAD_FORMAT, message: ''});
    }
});

module.exports = router;