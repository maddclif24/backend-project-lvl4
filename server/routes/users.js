// @ts-check

import i18next, { use } from 'i18next';

export default (app) => {
  app
    .get('/users', { name: 'users' }, async (req, reply) => {
      const users = await app.objection.models.user.query();
      reply.render('users/index', { users });
      return reply;
    })
    .get('/users/new', { name: 'newUser' }, (req, reply) => {
      const user = new app.objection.models.user();
      reply.render('users/new', { user });
    })
    .get('/users/:id/edit', async (req, reply) => {
      const user = await app.objection.models.user.query().findById(req.params.id);
      try {
        await app.authenticate(req);
        reply.render('users/edit', { user });
      } catch ({ data }) {
        reply.redirect(app.reverse('root'));
      }
      return reply;
    })
    .patch('/users/:id', { name: 'userEdit' }, async (req, reply) => {
      const users = await app.objection.models.user.query();
      try {
        const { params, body } = req;
        const user = await app.objection.models.user.query().findById(params.id);
        await user.$query().patch(body.data).findById(params.id);
        req.flash('success', i18next.t('flash.users.edit.success'));
        reply.redirect(app.reverse('users'));
      } catch ({ data }) {
        req.flash('error', i18next.t('flash.users.edit.error'));
        reply.render('users/index', { users });
      }
      return reply;
    })
    .delete('/users/:id', { name: 'userDelete' }, async (req, reply) => {
      const users = await app.objection.models.user.query();
      try {
        await app.authenticate(req);
        const { params } = req;
        const user = await app.objection.models.user.query().findById(params.id);
        await user.$query().delete().where(user);
        req.flash('success', i18next.t('flash.users.delete.success'));
        reply.redirect(app.reverse('users'));
      } catch ({ data }) {
        req.flash('error', i18next.t('flash.users.delete.error'));
        reply.render('users/index', { users });
      }
      return reply;
    })
    .post('/users', async (req, reply) => {
      const user = new app.objection.models.user();
      user.$set(req.body.data);

      try {
        const validUser = await app.objection.models.user.fromJson(req.body.data);
        await app.objection.models.user.query().insert(validUser);
        req.flash('info', i18next.t('flash.users.create.success'));
        reply.redirect(app.reverse('root'));
      } catch ({ data }) {
        req.flash('error', i18next.t('flash.users.create.error'));
        reply.render('users/new', { user, errors: data });
      }

      return reply;
    });
};
