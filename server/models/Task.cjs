// @ts-check

// const objectionUnique = require('objection-unique');
const path = require('path');
const BaseModel = require('./BaseModel.cjs');
// const unique = objectionUnique({ fields: ['name'] });

module.exports = class Task extends BaseModel {
  static get tableName() {
    return 'tasks';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['name', 'statusId'],
      properties: {
        id: { type: 'integer' },
        name: { type: 'string', minLength: 1 },
        description: { type: 'string', minLength: 1 },
        statusId: { type: 'string' },
        creatorId: { type: 'integer' },
        executorId: { type: 'string' },
      },
    };
  }

  static get relationMappings() {
    return {
      status: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: 'Status.cjs',
        join: {
          from: 'tasks.status_id',
          to: 'statuses.id',
        },
      },
      creator: {
        relation: BaseModel.HasManyRelation,
        modelClass: 'User.cjs',
        join: {
          from: 'tasks.creator_id',
          to: 'users.id',
        },
        label: {
          relation: BaseModel.ManyToManyRelation,
          modelClass: 'Label.cjs',
        },
      },
    };
  }
};
