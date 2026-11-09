const cds = require('@sap/cds')
const { GET } = cds.test(__dirname + '/..')

const url = '/odata/v4/processor/Incidents'
const as = (username) => ({ auth: { username } })

describe('Authorization', () => {
  it('rejects unauthenticated requests', async () => {
    await expect(GET(url, { auth: undefined })).rejects.toMatchObject({ response: { status: 401 } })
  })

  it('rejects an authenticated user without the support role', async () => {
    await expect(GET(url, as('dave'))).rejects.toMatchObject({ response: { status: 403 } })
  })

  it('allows a support user', async () => {
    const { status } = await GET(url, as('alice'))
    expect(status).toBe(200)
  })
})