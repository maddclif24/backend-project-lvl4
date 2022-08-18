/* eslint-disable max-len */
/* eslint-disable no-param-reassign */
// @ts-check

import i18next, { use } from 'i18next';
import _ from 'lodash';

export default (app) => {
  app
    .get('/tasks', { name: 'tasks' }, async (req, reply) => {
      const tasks = await app.objection.models.task.query();
      const dataTasks = await Promise.all(tasks.map(async (item) => {
        const status = await app.objection.models.status.query().findById(item.statusId);
        const creator = await app.objection.models.user.query().findById(item.creatorId);
        const executor = await app.objection.models.user.query().findById(item.executorId);
        return {
          id: item.id,
          name: item.name,
          description: item.description,
          statusId: status.name,
          executorId: executor ? executor.fullName : '',
          creatorId: creator.fullName,
          createdAt: item.createdAt,
        };
      }));
      reply.render('tasks/index', { dataTasks });
      return reply;
    })
    .get('/tasks/new', { name: 'newTask' }, async (req, reply) => {
      const task = await app.objection.models.task.query();
      const users = await app.objection.models.user.query();
      const statuses = await app.objection.models.status.query();
      const labels = await app.objection.models.label.query();
      reply.render('tasks/newTask', {
        task, users, statuses, labels,
      });
      return reply;
    })
    .get('/tasks/:id', { name: 'taskInfo' }, async (req, reply) => {
      const task = await app.objection.models.task.query().findById(req.params.id);
      // const taskTest = await app.objection.models.task.query().findById(req.params.id).withGraphFetched('status');
      const creator = await app.objection.models.user.query().findById(task.creatorId);
      const executor = await app.objection.models.user.query().findById(task.executorId);
      const status = await app.objection.models.status.query().findById(task.statusId);
      // console.log(task);
      // const labelsIds = task.labels.split(',');
      // const check = await task.$relatedQuery('label');
      // console.log(check);
      const labels = await app.objection.models.label.query().findByIds(task.labels);

      const labelsColors = [
        { background: 'bg-primary', text: 'text-white' },
        { background: 'bg-secondary', text: 'text-white' },
        { background: 'bg-success', text: 'text-white' },
        { background: 'bg-warning', text: 'text-black' },
        { background: 'bg-info', text: 'text-black' },
        { background: 'bg-light', text: 'text-black' },
        { background: 'bg-dark', text: 'text-white' },
      ];

      const coloredLabels = labels.map(({ name }) => {
        const colorIndex = _.random(0, labelsColors.length - 1);
        const color = labelsColors[colorIndex];
        return { name, color };
      });
      reply.render('tasks/info', {
        task, creator, executor, status, coloredLabels,
      });
      return reply;
    })
    .get('/tasks/:id/edit', async (req, reply) => {
      const task = await app.objection.models.task.query().findById(req.params.id);
      const creator = await app.objection.models.user.query().findById(task.creatorId);
      const executors = await app.objection.models.user.query();
      const statuses = await app.objection.models.status.query();

      const { id } = await app.objection.models.status.query().findById(task.statusId);
      const currentExecotur = await app.objection.models.user.query().findById(task.executorId);
      console.log(id, currentExecotur);
      // const labelsIds = task.labels ? task.labels.split(',') : [];

      const labels = await app.objection.models.label.query();
      const currentLabels = await app.objection.models.label.query().findByIds(task.labels);

      reply.render('tasks/edit', {
        task, creator, executors, statuses, id, currentExecotur, labels, currentLabels,
      });
      return reply;
    })
    .patch('/tasks/:id', { name: 'editTask' }, async (req, reply) => {
      const tasks = await app.objection.models.task.query();
      try {
        const { params, body } = req;
        const task = await app.objection.models.task.query().findById(params.id);
        const parseData = { ...body.data, labels: _.has(body.data, 'labels') ? _.flatten(body.data.labels) : [] };
        console.log(task, parseData);
        await task.$query().patch(parseData).findById(params.id);
        req.flash('success', i18next.t('flash.tasks.edit.success'));
        reply.redirect(app.reverse('tasks'));
      } catch ({ data }) {
        console.log(data);
        // !!!Исправить фронт ошибок!!!
        req.flash('error', i18next.t('flash.tasks.edit.error'));
        reply.render('tasks/newTask', { tasks });
      }
      return reply;
    })
    .delete('/tasks/:id', { name: 'deleteTask' }, async (req, reply) => {
      const userId = req.user.id;
      try {
        const task = await app.objection.models.task.query().findById(req.params.id);
        const creator = await app.objection.models.user.query().findById(task.creatorId);
        if (userId === creator.id) {
          await task.$query().deleteById(req.params.id);
          req.flash('success', i18next.t('flash.tasks.delete.success'));
          reply.redirect(app.reverse('tasks'));
        } else {
          req.flash('error', i18next.t('flash.tasks.delete.error'));
          reply.redirect(app.reverse('tasks'));
        }
      } catch {
        req.flash('error', i18next.t('flash.tasks.delete.error'));
        reply.redirect(app.reverse('tasks'));
      }
      return reply;
    })
    .post('/tasks', { name: 'createNewTask' }, async (req, reply) => {
      const task = new app.objection.models.task();
      const statuses = await app.objection.models.status.query();
      const { user } = req;
      const { data } = req.body;
      const dataParse = Object.entries(data).reduce((acc, [key, value]) => {
        if (key === 'statusId') {
          acc = { ...acc, statusId: Number(value) };
        } else if (key === 'executorId') {
          acc = { ...acc, executorId: Number(value) };
        } else if (key === 'labels') {
          const newValue = Array.isArray(value) ? value.map((id) => Number(id)) : [Number(value)];
          acc = { ...acc, labels: newValue };
        } else {
          acc = {
            ...acc, [key]: value, labels: [], creatorId: user.id,
          };
        }
        return acc;
      }, {});

      try {
        const createTask = await app.objection.models.task.fromJson(dataParse);
        // const labels = await app.objection.models.label.query().findByIds(createTask.labels);
        // await app.objection.models.task.query().insert(createTask);
        // req.flash('info', i18next.t('flash.tasks.create.success'));
        // reply.redirect(app.reverse('tasks'));
      } catch (error) {
        console.log(error);
        req.flash('error', i18next.t('flash.tasks.create.error'));
        reply.render('tasks/newTask', { task, statuses, errors: data });
      }
      return reply;
    });
};
