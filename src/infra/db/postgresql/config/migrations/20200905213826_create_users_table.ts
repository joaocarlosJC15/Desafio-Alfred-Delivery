import Knex from 'knex'

export async function up (knex: Knex): Promise<void> {
  return knex.schema.createTable('users', (table: Knex.TableBuilder) => {
    table.increments('id').primary()
    table.string('name', 200).notNullable()
    table.string('email', 200).notNullable()
    table.string('password', 200).notNullable()
    table.date('birthDate').notNullable()
    table.string('token', 300).nullable()
  })
}

export async function down (knex: Knex): Promise<void> {
  return knex.raw('DROP TABLE users CASCADE')
}
