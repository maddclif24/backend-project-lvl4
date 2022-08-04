// @ts-check

export default {
  translation: {
    appName: 'Менеджер задач',
    flash: {
      session: {
        create: {
          success: 'Вы залогинены',
          error: 'Неправильный email или пароль',
        },
        delete: {
          success: 'Вы разлогинены',
        },
      },
      users: {
        create: {
          error: 'Не удалось зарегистрировать',
          success: 'Пользователь успешно зарегистрирован',
        },
        edit: {
          success: 'Пользователь успешно изменён',
          error: 'Не удалось изменить пользователя',
        },
        delete: {
          success: 'Пользователь удален',
          error: 'Не удалось удалить пользователя',
        },
      },
      authError: 'Доступ запрещён! Пожалуйста, авторизируйтесь.',
      statuses: {
        create: {
          success: 'Статус создан',
          error: 'Не удалось создать статус',
        },
        edit: {
          success: 'Статус изменен',
          error: 'Не удалось изменить статус',
        },
        delete: {
          success: 'Статус удален',
          error: 'Не удалось удалить статус',
        },
      },
      labels: {
        create: {
          success: 'Метка создана',
          error: 'Не удалось создать метку',
        },
        edit: {
          success: 'Метка изменена',
          error: 'Не удалось изменить метку',
        },
        delete: {
          success: 'Метка удалена',
          error: 'Не удалось удалить метку',
        },
      },
      tasks: {
        create: {
          success: 'Задача создана',
          error: 'Не удалось создать задачу',
        },
        edit: {
          success: 'Задача изменена',
          error: 'Не удалось изменить задачу',
        },
        delete: {
          success: 'Задача удалена',
          error: 'Не удалось удалить задачу',
        },
      },
    },
    layouts: {
      application: {
        users: 'Пользователи',
        signIn: 'Вход',
        signUp: 'Регистрация',
        signOut: 'Выход',
        statuses: 'Статусы',
        tags: 'Метки',
        tasks: 'Задачи',
      },
    },
    views: {
      session: {
        new: {
          signIn: 'Вход',
          submit: 'Войти',
        },
      },
      users: {
        id: 'ID',
        fullName: 'Полное имя',
        email: 'Email',
        createdAt: 'Дата создания',
        new: {
          submit: 'Сохранить',
          signUp: 'Регистрация',
        },
        edit: {
          title: 'Изменение пользователя',
          submit: 'Изменить',
        },
      },
      statuses: {
        id: 'ID',
        name: 'Наименование',
        createdAt: 'Дата создания',
        edit: {
          title: 'Создание статуса',
          inputName: 'Наименование',
          submit: 'Создать статус',
        },
      },
      welcome: {
        index: {
          hello: 'Привет пользователь!',
          description: 'Практические курсы по программированию',
          more: 'Узнать Больше',
        },
      },
      tasks: {
        id: 'ID',
        description: 'Наименование',
        status: 'Статус',
        author: 'Автор',
        executor: 'Исполнитель',
        createdAt: 'Дата создания',
      },
      labels: {
        id: 'ID',
        name: 'Наименование',
        createdAt: 'Дата создания',
        edit: {
          title: 'Создание Метки',
          inputName: 'Наименование',
          submit: 'Создать метку',
        },
      },
    },
  },
};
