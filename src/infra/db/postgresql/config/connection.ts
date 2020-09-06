import knex from 'knex'

import { test, development } from './knexfile'

const connection = process.env.NODE_ENV === 'test' ? knex(test) : knex(development)

export default connection
