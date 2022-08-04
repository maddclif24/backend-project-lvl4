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
          executorId: executor.fullName,
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
      console.log(labels);
      reply.render('tasks/newTask', {
        task, users, statuses, labels,
      });
      return reply;
    })
    .get('/tasks/:id', { name: 'taskInfo' }, async (req, reply) => {
      const task = await app.objection.models.task.query().findById(req.params.id);
      const creator = await app.objection.models.user.query().findById(task.creatorId);
      const executor = await app.objection.models.user.query().findById(task.executorId);
      const status = await app.objection.models.status.query().findById(task.statusId);
      const labelsIds = task.labels.split(',');
      const labels = await app.objection.models.label.query().findByIds(labelsIds);

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
      const labelsIds = task.labels ? task.labels.split(',') : [];
      const labels = await app.objection.models.label.query();
      const currentLabels = await app.objection.models.label.query().findByIds(labelsIds);

      // console.log(task, labels, currentLabels);
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
        console.log(task, body.data);
        await task.$query().patch(body.data).findById(params.id);
        req.flash('success', i18next.t('flash.tasks.edit.success'));
        reply.redirect(app.reverse('tasks'));
      } catch ({ data }) {
        // !!!Исправить фронт ошибок!!!
        req.flash('error', i18next.t('flash.tasks.edit.error'));
        reply.render('tasks/index', { tasks });
        // console.log(data);
        // console.log(error);
      }
      return reply;
    })
    .delete('/tasks/:id', { name: 'deleteTask' }, async (req, reply) => {
      const userId = req.user.id;
      const task = await app.objection.models.task.query().findById(req.params.id);
      const creator = await app.objection.models.user.query().findById(task.creatorId);
      if (userId === creator.id) {
        await task.$query().deleteById(req.params.id);
        req.flash('success', i18next.t('flash.tasks.delete.success'));
        reply.redirect(app.reverse('tasks'));
      } else throw new Error('Вы не можете удалить эту задачу');
      return reply;
    })
    .post('/tasks', { name: 'createNewTask' }, async (req, reply) => {
      const task = new app.objection.models.task();
      // console.log(new app.objection.models.task());
      const { body, user } = req;
      // console.log(body);
      const dataTask = { ...body.data, creatorId: user.id };
      task.$set(dataTask);
      try {
        const createTask = await app.objection.models.task.fromJson(dataTask);
        // console.log(createTask);
        await app.objection.models.task.query().insert(createTask);
        req.flash('info', i18next.t('flash.tasks.create.success'));
        reply.redirect(app.reverse('tasks'));
      } catch (e) {
        // req.flash('error', i18next.t('flash.statuses.create.error'));
        console.log(e);
        // reply.render('statuses/newStatus', { status, errors: data });
      }
      return reply;
    });
};
