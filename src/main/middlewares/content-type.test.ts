import request from 'supertest'
import app from '../config/app'

describe('Content Type Middleware', () => {
  test('Garantir que o content-type do response do express seja do tipoe JSON', async () => {
    app.get('/test_content_type', (request, response) => {
      response.send('')
    })

    await request(app)
      .get('/test_content_type')
      .expect('content-type', /json/)
  })
})
