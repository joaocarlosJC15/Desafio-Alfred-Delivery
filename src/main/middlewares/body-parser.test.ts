import request from 'supertest'
import app from '../config/app'

describe('Body Parser Middleware', () => {
  test('Garantir que o express reconheça o body do request como um JSON', async () => {
    app.post('/test_body_parser', (request, response) => {
      response.send(request.body)
    })

    await request(app)
      .post('/test_body_parser')
      .send({ name: 'Joao' })
      .expect({ name: 'Joao' })
  })
})
