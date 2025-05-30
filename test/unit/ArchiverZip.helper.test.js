// Helpers

const ArchiverZip = require('../../helper/ArchiverZip.helper.js')

// Libraries

const fs = require('fs')

// Constants

const { FILE_SYSTEM_SEPARATOR, TEMP_FOLDER_NAME } = require('../../helper/Constant.helper')

// Errors

const ArchiveFail = require('../../error/ArchiveFail.error.js')
const BadFormat = require('../../error/BadFormat.error.js')

// Setup

const tempPath = `${process.cwd()}${FILE_SYSTEM_SEPARATOR}${TEMP_FOLDER_NAME}`

// Happy path test suite

describe('Zip archiver', () => {
  it('zips files', async () => {
    // Given

    let archiverZip = new ArchiverZip()
    fs.mkdirSync(`${tempPath}${FILE_SYSTEM_SEPARATOR}ArchiverZip_TopDirectory1`)
    fs.mkdirSync(
      `${tempPath}${FILE_SYSTEM_SEPARATOR}ArchiverZip_TopDirectory1${FILE_SYSTEM_SEPARATOR}ArchiverZip_Directory1`
    )
    fs.mkdirSync(
      `${tempPath}${FILE_SYSTEM_SEPARATOR}ArchiverZip_TopDirectory1${FILE_SYSTEM_SEPARATOR}ArchiverZip_Directory2`
    )
    fs.writeFileSync(
      `${tempPath}${FILE_SYSTEM_SEPARATOR}ArchiverZip_TopDirectory1${FILE_SYSTEM_SEPARATOR}ArchiverZip_Directory1${FILE_SYSTEM_SEPARATOR}ArchiverZip_File1.txt`,
      'Test'
    )
    fs.writeFileSync(
      `${tempPath}${FILE_SYSTEM_SEPARATOR}ArchiverZip_TopDirectory1${FILE_SYSTEM_SEPARATOR}ArchiverZip_Directory2${FILE_SYSTEM_SEPARATOR}ArchiverZip_File2.txt`,
      'Test'
    )

    // When Then

    await archiverZip
      .archiveByList(
        [`ArchiverZip_Directory1`, `ArchiverZip_Directory2`],
        'ArchiverZip_TopDirectory1'
      )
      .then((result) => {
        const archiveCreated = fs.existsSync(result)
        expect(archiveCreated).toBe(true)

        // Free

        fs.rmSync(`${tempPath}${FILE_SYSTEM_SEPARATOR}ArchiverZip_TopDirectory1`, {
          recursive: true,
          force: true
        })
      })
  })
})

// Failure cases test suite

describe('Zip archiver tries to', () => {
  it('zip undefined file list', async () => {
    // Given

    let archiverZip = new ArchiverZip()

    // When Then

    await expect(archiverZip.archiveByList(undefined)).rejects.toThrow(BadFormat)
  })

  it('zip null file list', async () => {
    // Given

    let archiverZip = new ArchiverZip()

    // When Then

    await expect(archiverZip.archiveByList(null)).rejects.toThrow(BadFormat)
  })

  it('zip empty file list', async () => {
    // Given

    let archiverZip = new ArchiverZip()

    // When Then

    await expect(archiverZip.archiveByList([])).rejects.toThrow(BadFormat)
  })

  it('zip file list with unknown files', async () => {
    // Given

    let archiverZip = new ArchiverZip()

    // When Then

    await expect(archiverZip.archiveByList(['unknown'])).rejects.toThrow(ArchiveFail)
  })
})
