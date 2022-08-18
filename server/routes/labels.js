/* eslint-disable max-len */
// @ts-check

import i18next, { use } from 'i18next';

export default (app) => {
  app
    .get('/labels', { name: 'labels' }, async (req, reply) => {
      const labels = await app.objection.models.label.query();
      reply.render('labels/index', { labels });
      return reply;
    })
    .get('/labels/new', { name: 'newLabel' }, async (req, reply) => {
      const label = await app.objection.models.label.query();
      reply.render('labels/newLabel', { label });
      return reply;
    })
    .post('/labels', { name: 'createNewLabel' }, async (req, reply) => {
      const { body } = req;
      const label = new app.objection.models.label();
      label.$set(body.data);
      try {
        const createLabel = await app.objection.models.label.fromJson(body.data);
        console.log(createLabel);
        await app.objection.models.label.query().insert(createLabel);
        req.flash('info', i18next.t('flash.labels.create.success'));// !!!!!!!!!!!
        reply.redirect(app.reverse('labels'));
      } catch ({ data }) {
        console.log(data);
        req.flash('error', i18next.t('flash.labels.create.error'));// !!!!!!!!!!1
        console.log({ label, errors: data });
        reply.render('labels/newLabel', { label, errors: data });// !!!!!!!!!!!
      }
      return reply;
    })
    .get('/labels/:id/edit', async (req, reply) => {
      const label = await app.objection.models.label.query().findById(req.params.id);
      try {
        reply.render('labels/edit', { label });
      } catch ({ data }) {
        reply.redirect(app.reverse('root'));
      }
      return reply;
    })
    .patch('/labels/:id', { name: 'editLabel' }, async (req, reply) => {
      const labels = await app.objection.models.status.query();
      try {
        const { params, body } = req;
        const label = await app.objection.models.label.query().findById(params.id);
        console.log(label);
        await label.$query().patch(body.data).findById(params.id);
        req.flash('success', i18next.t('flash.labels.edit.success'));
        reply.redirect(app.reverse('labels'));
      } catch ({ data }) {
        req.flash('error', i18next.t('flash.labels.edit.error'));
        reply.render('statuses/index', { labels });
      }
      return reply;
    })
    .delete('/labels/:id', { name: 'deleteLabel' }, async (req, reply) => {
      const labels = await app.objection.models.status.query();
      try {
        const { params } = req;
        const label = await app.objection.models.label.query().findById(params.id).withGraphFetched('label');
        const tasks = await app.objection.models.task.query();
        console.log(label);
        // Не забыть поправить isRelationWithTask (смотреть sqlite3 в поле labels, проблема со строками)


        // const taskTest = await app.objection.models.task;
        // console.log(taskTest);
        // const isRelationWithTask = await app.objection.models.task.query().findOne({ labels: `[${label.id}]` });
        // console.log(isRelationWithTask);
        // console.log(label, tasks, '!!!!!!!!!!!!!!!!!!!!!!', isRelationWithTask);
        // await label.$query().deleteById(params.id);
        // req.flash('success', i18next.t('flash.labels.delete.success'));
        // reply.redirect(app.reverse('labels'));
      } catch (error) {
        console.log(error);
        // req.flash('error', i18next.t('flash.labels.delete.error'));
        // reply.render('users/index', { labels });
      }
      return reply;
    });
};
