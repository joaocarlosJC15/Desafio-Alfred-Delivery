import * as Knex from 'knex'

export async function up (knex: Knex): Promise<void> {
  return knex.schema.createTable('launchs', (table: Knex.TableBuilder) => {
    table.increments('id').primary()
    table.string('description', 1000).notNullable()
    table.string('type', 10).notNullable()
    table.decimal('input', 10, 2).notNullable()
    table.decimal('output', 10, 2).notNullable()
    table.decimal('balance', 10, 2).notNullable()
    table.specificType('date', 'timestamptz').notNullable()
    table.boolean('disabled').notNullable()
    table.integer('category_id').references('id').inTable('categories').notNullable()
  })
}

export async function down (knex: Knex): Promise<void> {
  return knex.schema.dropTable('launchs')
}
