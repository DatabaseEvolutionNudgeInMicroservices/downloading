/**
 * @overview Represents a download failure.
 */
const { ARCHIVE_FAIL } = require('./Constant.error.js')

class ArchiveFail extends Error {
  constructor(message) {
    super()
    this.name = ARCHIVE_FAIL
    this.message = message !== undefined ? message : ''
  }
}

module.exports = ArchiveFail
