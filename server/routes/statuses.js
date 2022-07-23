// @ts-check

import i18next, { use } from 'i18next';

export default (app) => {
  app
    .get('/statuses', { name: 'statuses' }, async (req, reply) => {
      const statuses = await app.objection.models.status.query();
      reply.render('statuses/index', { statuses });
      return reply;
    })
    .get('/statuses/new', { name: 'newStatus' }, async (req, reply) => {
      const status = await app.objection.models.status.query();
      reply.render('statuses/newStatus', { status });
      return reply;
    })
    .post('/statuses', { name: 'createNewStatus' }, async (req, reply) => {
      const { body } = req;
      const status = new app.objection.models.status();
      status.$set(body.data);
      try {
        const createStatus = await app.objection.models.status.fromJson(body.data);
        console.log(createStatus);
        await app.objection.models.status.query().insert(createStatus);
        req.flash('info', i18next.t('flash.statuses.create.success'));
        reply.redirect(app.reverse('statuses'));
      } catch ({ data }) {
        req.flash('error', i18next.t('flash.statuses.create.error'));
        reply.render('statuses/newStatus', { status, errors: data });
      }
      return reply;
    })
    .get('/statuses/:id/edit', async (req, reply) => {
      const status = await app.objection.models.status.query().findById(req.params.id);
      try {
        reply.render('statuses/edit', { status });
      } catch ({ data }) {
        reply.redirect(app.reverse('root'));
      }
      return reply;
    })
    .patch('/statuses/:id', { name: 'editStatus' }, async (req, reply) => {
      const statuses = await app.objection.models.status.query();
      try {
        const { params, body } = req;
        const status = await app.objection.models.status.query().findById(params.id);
        console.log(status);
        await status.$query().patch(body.data).findById(params.id);
        req.flash('success', i18next.t('flash.statuses.edit.success'));
        reply.redirect(app.reverse('statuses'));
      } catch ({ data }) {
        req.flash('error', i18next.t('flash.statuses.edit.error'));
        reply.render('statuses/index', { statuses });
      }
      return reply;
    })
    .delete('/statuses/:id', { name: 'deleteStatus' }, async (req, reply) => {
      const statuses = await app.objection.models.status.query();
      try {
        const { params } = req;
        const status = await app.objection.models.status.query().findById(params.id);
        await status.$query().deleteById(params.id);
        req.flash('success', i18next.t('flash.statuses.delete.success'));
        reply.redirect(app.reverse('users'));
      } catch ({ data }) {
        req.flash('error', i18next.t('flash.statuses.delete.error'));
        reply.render('users/index', { statuses });
      }
      return reply;
    });
};
