// @ts-check

// const objectionUnique = require('objection-unique');
const path = require('path');
const BaseModel = require('./BaseModel.cjs');
// const unique = objectionUnique({ fields: ['name'] });
const User = require('./User.cjs');
const Label = require('./Label.cjs');

// @ts-ignore
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
        description: { type: 'string' },
        statusId: { type: 'integer' },
        creatorId: { type: 'integer' },
        executorId: { type: 'integer' },
        labels: { type: 'array', default: [] },
      },
    };
  }

  static get relationMappings() {
    return {
      status: {
        relation: BaseModel.HasOneRelation,
        modelClass: path.join(__dirname, 'Status.cjs'),
        join: {
          from: 'tasks.statusId',
          to: 'statuses.id',
        },
      },
      creator: {
        relation: BaseModel.HasManyRelation,
        modeClass: User,
        join: {
          from: 'tasks.creatorId',
          to: 'users.id',
        },
      },
      label: {
        relation: BaseModel.ManyToManyRelation,
        modeClass: Label,
        join: {
          from: 'task.id',
          through: {
            // persons_movies is the join table.
            from: 'task__labels.taskId',
            to: 'task__labels.labelId',
          },
          to: 'labels.id',
        },
      },
    };
  }
};
