import Knex from 'knex'

export async function up (knex: Knex): Promise<any> {
  return knex.schema.createTable('users', (table: Knex.TableBuilder) => {
    table.increments('id').primary()
    table.string('name', 200).notNullable()
    table.string('email', 200).notNullable()
    table.string('password', 200).notNullable()
    table.date('birthDate').notNullable()
    table.string('token', 300).nullable()
  })
}

exports.down = function (knex: Knex) {
  return knex.schema.dropTable('users')
}
