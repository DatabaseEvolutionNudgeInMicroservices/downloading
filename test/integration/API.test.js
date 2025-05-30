const request = require('supertest')

const baseURL = 'http://localhost:8080' // If dockerized.
//const baseURL = 'http://localhost:3000' // If not dockerized, launch from the npm console.

// Setup

const gitRepositoryList = [
  'https://github.com/overleaf/document-updater/tree/b9011d28a698d9310d2c4b7d9b85f925ae23c865'
]

// Happy path test suite

describe('DENIM Downloading API', () => {
  it('downloads and zips a git repository list', async () => {
    const response = await request(baseURL).post('/git').send(gitRepositoryList).expect(200)
    expect(response.headers['content-type']).toBe('application/zip')
  })
})

// Failure cases test suite

describe('DENIM Downloading API tries to', () => {
  it('download and zip an undefined repository list', async () => {
    return request(baseURL).post('/git').send(undefined).expect(406)
  })

  it('download and zip a null repository list', async () => {
    return request(baseURL).post('/git').send(null).expect(406)
  })

  it('download and zip an empty repository list', async () => {
    return request(baseURL).post('/git').send([]).expect(406)
  })

  it('download and zip a repository list with undefined repositories', async () => {
    return request(baseURL).post('/git').send([undefined]).expect(406)
  })

  it('download and zip a repository list with null repositories', async () => {
    return request(baseURL).post('/git').send([null]).expect(406)
  })

  it('download and zip a repository list with empty repository', async () => {
    return request(baseURL).post('/git').send(['']).expect(406)
  })

  it('download and zip a git repository list with not found repositories', async () => {
    return request(baseURL)
      .post('/git')
      .send(['https://github.com/unknown/unknown/tree/aaa'])
      .expect(404)
  })

  it('download and zip a git repository list without hash', async () => {
    return request(baseURL)
      .post('/git')
      .send(['https://github.com/overleaf/document-updater/'])
      .expect(406)
  })

  it('download and zip a git repository list with not found hash', async () => {
    return request(baseURL)
      .post('/git')
      .send(['https://github.com/overleaf/document-updater/tree/aaa'])
      .expect(404)
  })
})
