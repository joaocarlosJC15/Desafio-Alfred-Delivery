import request from 'supertest'
import app from '../config/app'

describe('CORS Middleware', () => {
  test('Garantir que o CORS esteja configurado corretamente', async () => {
    app.get('/test_cors', (request, response) => {
      response.send()
    })

    await request(app)
      .get('/test_cors')
      .expect('Access-Control-Allow-Origin', '*')
      .expect('Access-Control-Allow-Methods', '*')
      .expect('Access-Control-Allow-Methods', '*')
  })
})
