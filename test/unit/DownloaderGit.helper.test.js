// Helpers

const DownloaderGit = require('../../helper/DownloaderGit.helper.js')

// Libraries

const fs = require('fs')

// Constants

const { FILE_SYSTEM_SEPARATOR, TEMP_FOLDER_NAME } = require('../../helper/Constant.helper')

// Errors

const DownloadFail = require('../../error/DownloadFail.error.js')
const BadFormat = require('../../error/BadFormat.error.js')

// Setup

const tempPath = `${process.cwd()}${FILE_SYSTEM_SEPARATOR}${TEMP_FOLDER_NAME}`

// Happy path test suite

describe('Git downloader', () => {
  it('downloads a repository', async () => {
    // Given

    let downloaderGit = new DownloaderGit()
    fs.mkdirSync(`${tempPath}${FILE_SYSTEM_SEPARATOR}DownloaderGit_Directory1`)

    // When Then

    await downloaderGit
      .downloadByElement(
        'https://github.com/overleaf/document-updater/tree/b9011d28a698d9310d2c4b7d9b85f925ae23c865',
        'DownloaderGit_Directory1'
      )
      .then((result) => {
        const repositoryCloned = fs.existsSync(
          `${tempPath}${FILE_SYSTEM_SEPARATOR}DownloaderGit_Directory1${FILE_SYSTEM_SEPARATOR}overleaf__document-updater__b9011d28a698d9310d2c4b7d9b85f925ae23c865`
        )
        const denimFileCreated = fs.existsSync(
          `${tempPath}${FILE_SYSTEM_SEPARATOR}DownloaderGit_Directory1${FILE_SYSTEM_SEPARATOR}overleaf__document-updater__b9011d28a698d9310d2c4b7d9b85f925ae23c865${FILE_SYSTEM_SEPARATOR}denim`
        )
        const returnedDownloadedRepositoryEqualsToGivenRepository =
          result === 'overleaf__document-updater__b9011d28a698d9310d2c4b7d9b85f925ae23c865'
        expect(
          repositoryCloned &&
            denimFileCreated &&
            returnedDownloadedRepositoryEqualsToGivenRepository
        ).toBe(true)

        // Free

        fs.rmSync(`${tempPath}${FILE_SYSTEM_SEPARATOR}DownloaderGit_Directory1`, {
          recursive: true,
          force: true
        })
      })
  })

  it('downloads a repository list', async () => {
    // Given

    let downloaderGit = new DownloaderGit()
    fs.mkdirSync(`${tempPath}${FILE_SYSTEM_SEPARATOR}DownloaderGit_Directory2`)
    let repositoryList = [
      'https://github.com/overleaf/document-updater/tree/aa30da573b3f091e8d3c22805c7f0a5a794a999a',
      'https://github.com/overleaf/docstore/tree/32b4e942977fde88ddf9b2be2aa06236e89be66e'
    ]

    // When Then

    await downloaderGit
      .downloadByList(repositoryList, 'DownloaderGit_Directory2')
      .then(async (result) => {
        const repositoryCloned1 = fs.existsSync(
          `${tempPath}${FILE_SYSTEM_SEPARATOR}DownloaderGit_Directory2${FILE_SYSTEM_SEPARATOR}overleaf__document-updater__aa30da573b3f091e8d3c22805c7f0a5a794a999a`
        )
        const denimFileCreated1 = fs.existsSync(
          `${tempPath}${FILE_SYSTEM_SEPARATOR}DownloaderGit_Directory2${FILE_SYSTEM_SEPARATOR}overleaf__document-updater__aa30da573b3f091e8d3c22805c7f0a5a794a999a${FILE_SYSTEM_SEPARATOR}denim`
        )
        const repositoryCloned2 = fs.existsSync(
          `${tempPath}${FILE_SYSTEM_SEPARATOR}DownloaderGit_Directory2${FILE_SYSTEM_SEPARATOR}overleaf__docstore__32b4e942977fde88ddf9b2be2aa06236e89be66e`
        )
        const denimFileCreated2 = fs.existsSync(
          `${tempPath}${FILE_SYSTEM_SEPARATOR}DownloaderGit_Directory2${FILE_SYSTEM_SEPARATOR}overleaf__docstore__32b4e942977fde88ddf9b2be2aa06236e89be66e${FILE_SYSTEM_SEPARATOR}denim`
        )
        let returnedDownloadedRepositoriesListEqualsToGivenRepositoriesList =
          JSON.stringify(result) ===
          JSON.stringify([
            'overleaf__document-updater__aa30da573b3f091e8d3c22805c7f0a5a794a999a',
            'overleaf__docstore__32b4e942977fde88ddf9b2be2aa06236e89be66e'
          ])
        expect(
          repositoryCloned1 &&
            repositoryCloned2 &&
            repositoryCloned1 &&
            denimFileCreated1 &&
            denimFileCreated2 &&
            returnedDownloadedRepositoriesListEqualsToGivenRepositoriesList
        ).toBe(true)

        // Free

        fs.rmSync(`${tempPath}${FILE_SYSTEM_SEPARATOR}DownloaderGit_Directory2`, {
          recursive: true,
          force: true
        })
      })
  })
})

// Failure cases test suite

describe('Git downloader tries to', () => {
  it('download an undefined git repository', async () => {
    // Given

    let downloaderGit = new DownloaderGit()
    fs.mkdirSync(`${tempPath}${FILE_SYSTEM_SEPARATOR}DownloaderGit_Directory3`)
    let gitRepository = undefined

    // When Then

    await expect(downloaderGit.downloadByElement(gitRepository)).rejects.toThrow(BadFormat)

    // Free

    fs.rmSync(`${tempPath}${FILE_SYSTEM_SEPARATOR}DownloaderGit_Directory3`, {
      recursive: true,
      force: true
    })
  })

  it('download a null git repository', async () => {
    // Given

    let downloaderGit = new DownloaderGit()
    fs.mkdirSync(`${tempPath}${FILE_SYSTEM_SEPARATOR}DownloaderGit_Directory4`)
    let gitRepository = null

    // When Then

    await expect(downloaderGit.downloadByElement(gitRepository)).rejects.toThrow(BadFormat)

    // Free

    fs.rmSync(`${tempPath}${FILE_SYSTEM_SEPARATOR}DownloaderGit_Directory4`, {
      recursive: true,
      force: true
    })
  })

  it('download a repository without URL', async () => {
    // Given

    let downloaderGit = new DownloaderGit()
    fs.mkdirSync(`${tempPath}${FILE_SYSTEM_SEPARATOR}DownloaderGit_Directory5`)
    let gitRepository = ''

    // When Then

    await expect(downloaderGit.downloadByElement(gitRepository)).rejects.toThrow(BadFormat)

    // Free

    fs.rmSync(`${tempPath}${FILE_SYSTEM_SEPARATOR}DownloaderGit_Directory5`, {
      recursive: true,
      force: true
    })
  })

  it('download a not found git repository', async () => {
    // Given

    let downloaderGit = new DownloaderGit()
    fs.mkdirSync(`${tempPath}${FILE_SYSTEM_SEPARATOR}DownloaderGit_Directory6`)
    let gitRepository = 'https://github.com/unknown/unknown/tree/aaa'

    // When Then

    await expect(downloaderGit.downloadByElement(gitRepository)).rejects.toThrow(DownloadFail)

    // Free

    fs.rmSync(`${tempPath}${FILE_SYSTEM_SEPARATOR}DownloaderGit_Directory6`, {
      recursive: true,
      force: true
    })
  })

  it('download a git repository without hash', async () => {
    // Given

    let downloaderGit = new DownloaderGit()
    fs.mkdirSync(`${tempPath}${FILE_SYSTEM_SEPARATOR}DownloaderGit_Directory7`)
    let gitRepositoryList = 'https://github.com/overleaf/document-updater/'

    // When Then

    await expect(downloaderGit.downloadByElement(gitRepositoryList)).rejects.toThrow(BadFormat)

    // Free

    fs.rmSync(`${tempPath}${FILE_SYSTEM_SEPARATOR}DownloaderGit_Directory7`, {
      recursive: true,
      force: true
    })
  })

  it('download a git repository with not found hash', async () => {
    // Given

    let downloaderGit = new DownloaderGit()
    fs.mkdirSync(`${tempPath}${FILE_SYSTEM_SEPARATOR}DownloaderGit_Directory8`)
    let gitRepositoryList = 'https://github.com/overleaf/document-updater/tree/aaa'

    // When Then

    await expect(downloaderGit.downloadByElement(gitRepositoryList)).rejects.toThrow(DownloadFail)

    // Free

    fs.rmSync(`${tempPath}${FILE_SYSTEM_SEPARATOR}DownloaderGit_Directory8`, {
      recursive: true,
      force: true
    })
  })

  it('download an undefined git repository list', async () => {
    // Given

    let downloaderGit = new DownloaderGit()
    fs.mkdirSync(`${tempPath}${FILE_SYSTEM_SEPARATOR}DownloaderGit_Directory9`)
    let gitRepositoryList = undefined

    // When Then

    await expect(downloaderGit.downloadByList(gitRepositoryList)).rejects.toThrow(BadFormat)

    // Free

    fs.rmSync(`${tempPath}${FILE_SYSTEM_SEPARATOR}DownloaderGit_Directory9`, {
      recursive: true,
      force: true
    })
  })

  it('download a null git repository list', async () => {
    // Given

    let downloaderGit = new DownloaderGit()
    fs.mkdirSync(`${tempPath}${FILE_SYSTEM_SEPARATOR}DownloaderGit_Directory10`)
    let gitRepositoryList = null

    // When Then

    await expect(downloaderGit.downloadByList(gitRepositoryList)).rejects.toThrow(BadFormat)

    // Free

    fs.rmSync(`${tempPath}${FILE_SYSTEM_SEPARATOR}DownloaderGit_Directory10`, {
      recursive: true,
      force: true
    })
  })

  it('download an empty git repository list', async () => {
    // Given

    let downloaderGit = new DownloaderGit()
    fs.mkdirSync(`${tempPath}${FILE_SYSTEM_SEPARATOR}DownloaderGit_Directory11`)
    let gitRepositoryList = []

    // When Then

    await expect(downloaderGit.downloadByList(gitRepositoryList)).rejects.toThrow(BadFormat)

    // Free

    fs.rmSync(`${tempPath}${FILE_SYSTEM_SEPARATOR}DownloaderGit_Directory11`, {
      recursive: true,
      force: true
    })
  })

  it('download a git repository list with undefined repositories', async () => {
    // Given

    let downloaderGit = new DownloaderGit()
    fs.mkdirSync(`${tempPath}${FILE_SYSTEM_SEPARATOR}DownloaderGit_Directory12`)
    let gitRepositoryList = [undefined]

    // When Then

    await expect(downloaderGit.downloadByList(gitRepositoryList)).rejects.toThrow(BadFormat)

    // Free

    fs.rmSync(`${tempPath}${FILE_SYSTEM_SEPARATOR}DownloaderGit_Directory12`, {
      recursive: true,
      force: true
    })
  })

  it('download a git repository list with null repositories', async () => {
    // Given

    let downloaderGit = new DownloaderGit()
    fs.mkdirSync(`${tempPath}${FILE_SYSTEM_SEPARATOR}DownloaderGit_Directory13`)
    let gitRepositoryList = [null]

    // When Then

    await expect(downloaderGit.downloadByList(gitRepositoryList)).rejects.toThrow(BadFormat)

    // Free

    fs.rmSync(`${tempPath}${FILE_SYSTEM_SEPARATOR}DownloaderGit_Directory13`, {
      recursive: true,
      force: true
    })
  })

  it('download a git repository list with empty repositories', async () => {
    // Given

    let downloaderGit = new DownloaderGit()
    fs.mkdirSync(`${tempPath}${FILE_SYSTEM_SEPARATOR}DownloaderGit_Directory14`)
    let gitRepositoryList = ['']

    // When Then

    await expect(downloaderGit.downloadByList(gitRepositoryList)).rejects.toThrow(BadFormat)

    // Free

    fs.rmSync(`${tempPath}${FILE_SYSTEM_SEPARATOR}DownloaderGit_Directory14`, {
      recursive: true,
      force: true
    })
  })

  it('download a git repository list with not found repositories', async () => {
    // Given

    let downloaderGit = new DownloaderGit()
    fs.mkdirSync(`${tempPath}${FILE_SYSTEM_SEPARATOR}DownloaderGit_Directory15`)
    let gitRepositoryList = ['https://github.com/unknown/unknown/tree/aaa']

    // When Then

    await expect(downloaderGit.downloadByList(gitRepositoryList)).rejects.toThrow(DownloadFail)

    // Free

    fs.rmSync(`${tempPath}${FILE_SYSTEM_SEPARATOR}DownloaderGit_Directory15`, {
      recursive: true,
      force: true
    })
  })

  it('download a git repository list without hash', async () => {
    // Given

    let downloaderGit = new DownloaderGit()
    fs.mkdirSync(`${tempPath}${FILE_SYSTEM_SEPARATOR}DownloaderGit_Directory16`)
    let gitRepositoryList = ['https://github.com/overleaf/document-updater/']

    // When Then

    await expect(downloaderGit.downloadByList(gitRepositoryList)).rejects.toThrow(BadFormat)

    // Free

    fs.rmSync(`${tempPath}${FILE_SYSTEM_SEPARATOR}DownloaderGit_Directory16`, {
      recursive: true,
      force: true
    })
  })

  it('download a git repository list with not found hash', async () => {
    // Given

    let downloaderGit = new DownloaderGit()
    fs.mkdirSync(`${tempPath}${FILE_SYSTEM_SEPARATOR}DownloaderGit_Directory17`)
    let gitRepositoryList = ['https://github.com/overleaf/document-updater/tree/aaa']

    // When Then

    await expect(downloaderGit.downloadByList(gitRepositoryList)).rejects.toThrow(DownloadFail)

    // Free

    fs.rmSync(`${tempPath}${FILE_SYSTEM_SEPARATOR}DownloaderGit_Directory17`, {
      recursive: true,
      force: true
    })
  })
})
