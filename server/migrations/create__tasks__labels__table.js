// @ts-check

export const up = (knex) => (
  knex.schema.createTable('task__labels', (table) => {
    table.increments('id').primary();
    table.integer('label_id').references('id').inTable('tasks');
    table.integer('task_id').references('id').inTable('labels');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  })
);

export const down = (knex) => knex.schema.dropTable('task__labels');