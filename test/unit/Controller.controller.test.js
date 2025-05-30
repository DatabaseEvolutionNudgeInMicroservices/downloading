// Controllers

const Controller = require('../../controller/Controller.controller.js')

// Errors

const DownloadFail = require('../../error/DownloadFail.error.js')
const BadFormat = require('../../error/BadFormat.error.js')

// Libraries

const fs = require('fs')
const { FILE_SYSTEM_SEPARATOR, TEMP_FOLDER_NAME } = require('../../helper/Constant.helper')

// Setup

const tempPath = `${process.cwd()}${FILE_SYSTEM_SEPARATOR}${TEMP_FOLDER_NAME}`

// Happy path test suite

describe('Controller', () => {
  it('downloads and zips a git repository list', async () => {
    // Given

    let controller = new Controller()
    let gitRepositoryList = [
      'https://github.com/overleaf/document-updater/tree/b9011d28a698d9310d2c4b7d9b85f925ae23c865',
      'https://github.com/overleaf/document-updater/tree/aa30da573b3f091e8d3c22805c7f0a5a794a999a',
      'https://github.com/overleaf/docstore/tree/32b4e942977fde88ddf9b2be2aa06236e89be66e'
    ]
    fs.mkdirSync(`${tempPath}${FILE_SYSTEM_SEPARATOR}Controller_Directory1`)

    // When Then

    await controller.downloadGit(gitRepositoryList, 'Controller_Directory1').then((result) => {
      const repositoryCloned1 = fs.existsSync(
        `${tempPath}${FILE_SYSTEM_SEPARATOR}Controller_Directory1${FILE_SYSTEM_SEPARATOR}overleaf__document-updater__b9011d28a698d9310d2c4b7d9b85f925ae23c865`
      )
      const repositoryCloned2 = fs.existsSync(
        `${tempPath}${FILE_SYSTEM_SEPARATOR}Controller_Directory1${FILE_SYSTEM_SEPARATOR}overleaf__document-updater__aa30da573b3f091e8d3c22805c7f0a5a794a999a`
      )
      const repositoryCloned3 = fs.existsSync(
        `${tempPath}${FILE_SYSTEM_SEPARATOR}Controller_Directory1${FILE_SYSTEM_SEPARATOR}overleaf__docstore__32b4e942977fde88ddf9b2be2aa06236e89be66e`
      )
      expect(repositoryCloned1 && repositoryCloned2 && repositoryCloned3).toBe(true)

      fs.rmSync(`${tempPath}${FILE_SYSTEM_SEPARATOR}Controller_Directory1`, {
        recursive: true,
        force: true
      })
    })
  })

  it('cleans a downloaded and zipped git repository list', async () => {
    // Given

    let controller = new Controller()
    let gitRepositoryList = [
      'https://github.com/overleaf/document-updater/tree/b9011d28a698d9310d2c4b7d9b85f925ae23c865'
    ]
    fs.mkdirSync(`${tempPath}${FILE_SYSTEM_SEPARATOR}Controller_Directory2`)

    // When Then

    await controller
      .downloadGit(gitRepositoryList, 'Controller_Directory2')
      .then(async (result) => {
        await controller.clean('Controller_Directory2')
        const uniqueFolderExist = fs.existsSync(
          `${tempPath}${FILE_SYSTEM_SEPARATOR}Controller_Directory2`
        )
        expect(uniqueFolderExist).toBe(false)
      })
  })
})

// Failure cases test suite

describe('Controller tries to', () => {
  it('download and zip an undefined repository list', async () => {
    // Given

    let controller = new Controller()

    // When Then

    await expect(controller.downloadGit(undefined)).rejects.toThrow(BadFormat)
  })

  it('download and zip a null repository list', async () => {
    // Given

    let controller = new Controller()

    // When Then

    await expect(controller.downloadGit(null)).rejects.toThrow(BadFormat)
  })

  it('download and zip an empty repository list', async () => {
    // Given

    let controller = new Controller()

    // When Then

    await expect(controller.downloadGit([])).rejects.toThrow(BadFormat)
  })

  it('download and zip a repository list with undefined repositories', async () => {
    // Given

    let controller = new Controller()

    // When Then

    await expect(controller.downloadGit([undefined])).rejects.toThrow(BadFormat)
  })

  it('download and zip a repository list with null repositories', async () => {
    // Given

    let controller = new Controller()

    // When Then

    await expect(controller.downloadGit([null])).rejects.toThrow(BadFormat)
  })

  it('download and zip a repository list with empty repositories', async () => {
    // Given

    let controller = new Controller()

    // When Then

    await expect(controller.downloadGit([''])).rejects.toThrow(BadFormat)
  })

  it('download and zip a git repository list with not found repositories', async () => {
    // Given

    let gitRepositoryList = ['https://github.com/unknown/unknown/tree/aaa']
    let controller = new Controller()

    // When Then

    await expect(controller.downloadGit(gitRepositoryList)).rejects.toThrow(DownloadFail)
  })

  it('download and zip a git repository list without hash', async () => {
    // Given

    let gitRepositoryList = ['https://github.com/overleaf/document-updater/']
    let controller = new Controller()

    // When Then

    await expect(controller.downloadGit(gitRepositoryList)).rejects.toThrow(BadFormat)
  })

  it('download and zip a git repository list with not found hash', async () => {
    // Given

    let gitRepositoryList = ['https://github.com/overleaf/document-updater/tree/aaa']
    let controller = new Controller()

    // When Then

    await expect(controller.downloadGit(gitRepositoryList)).rejects.toThrow(DownloadFail)
  })
})
