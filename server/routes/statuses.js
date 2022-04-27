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
      reply.render('statuses/edit', { status });
      return reply;
    })
    .post('/statuses', { name: 'statusEdit' }, async (req, reply) => {
      const { body } = req;
      const status = new app.objection.models.status();
      status.$set(body.data);
      try {
        const createStatus = await app.objection.models.status.fromJson(body.data);
        await app.objection.models.status.query().insert(createStatus);
        req.flash('info', i18next.t('flash.statuses.create.success'));
        reply.redirect(app.reverse('statuses'));
      } catch ({ data }) {
        req.flash('error', i18next.t('flash.statuses.create.error'));
        reply.render('statuses/edit', { status, errors: data });
      }
      return reply;
    });
};
