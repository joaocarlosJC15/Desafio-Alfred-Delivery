import * as Knex from 'knex'

export async function up (knex: Knex): Promise<void> {
  return knex.schema.createTable('categories', (table: Knex.TableBuilder) => {
    table.increments('id').primary()
    table.string('name', 200).notNullable()
    table.boolean('disabled').notNullable()
    table.string('description', 1000).nullable()
    table.integer('user_id').references('id').inTable('users').notNullable()
  })
}

export async function down (knex: Knex): Promise<void> {
  return knex.schema.dropTable('categories')
}
