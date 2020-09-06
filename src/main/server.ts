import 'module-alias/register'

import app from './config/app'
import { applicationPort } from './config/env'

app.listen(applicationPort, () => {
  console.log(`Aplicação rodando com sucesso em http://localhost:${applicationPort}`)
  console.log()
})
