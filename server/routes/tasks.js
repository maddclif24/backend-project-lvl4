// @ts-check

import i18next, { use } from 'i18next';

export default (app) => {
  app
    .get('/tasks', { name: 'tasks' }, async (req, reply) => {
      const tasks = await app.objection.models.task.query();
      console.log(tasks);
      const filterTasks = await tasks.relatedQuery('creator');
      console.log(filterTasks);
      reply.render('tasks/index', { tasks });
      return reply;
    })
    .get('/tasks/new', { name: 'newTask' }, async (req, reply) => {
      const task = await app.objection.models.task.query();
      const users = await app.objection.models.user.query();
      const statuses = await app.objection.models.status.query();
      reply.render('tasks/newTask', { task, users, statuses });
      return reply;
    })
    .get('/tasks/:id', async (req, reply) => {

    })
    .get('/tasks/:id/edit', async (req, reply) => {

    })
    .patch('/tasks/:id', async (req, reply) => {

    })

    .post('/tasks', { name: 'createNewTask' }, async (req, reply) => {
      const task = new app.objection.models.task();
      // console.log(new app.objection.models.task());
      const { body, user } = req;
      const dataTask = { ...body.data, creatorId: user.id };
      task.$set(dataTask);
      try {
        const createTask = await app.objection.models.task.fromJson(dataTask);
        console.log(createTask);
        // await app.objection.models.task.query().insert(createTask);
        // req.flash('info', i18next.t('flash.statuses.create.success'));
        // reply.redirect(app.reverse('tasks'));
      } catch (e) {
        // req.flash('error', i18next.t('flash.statuses.create.error'));
        console.log(e);
        // reply.render('statuses/newStatus', { status, errors: data });
      }
      return reply;
    });
};
