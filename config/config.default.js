/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1575509336979_7291';

  // add your middleware config here
  config.middleware = [];

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
    statusCode: {
      /** 成功 */
      SUCCESS: 200,

      /** 创建成功，要返回数据  */
      CREATE: 201,

      /** 操作成功，但不返回数据 */
      NO_CONENT: 204,

      /** 参数异常，或者不明确的错误 */
      BAD_REQUEST: 400,

      /** 没有提供认证信息：未登陆 */
      UNAUTHORIZED: 401,

      /** 禁止访问：无权限 */
      FORBIDDEN: 403,

      /** 找不到数据 */
      NO_FOUND: 404,
    },
    security: {
      csrf: {
        enable: false,
      },
    },
    session: {
      key: 'EGG_SESS',
      maxAge: 60 * 24 * 3600 * 1000, // 30 天
      httpOnly: true,
      encrypt: true,
    },
    multipart: {
      fileSize: '1mb',
    },
  };

  config.io = {
    // init: { }, // passed to engine.io
    redis: {
      host: process.env.REDIS_HOST || '192.168.1.28',
      port: process.env.REDIS_PORT || '30377',
      auth_pass: process.env.REDIS_AUTH_PASS || '123456',
      db: 0,
    },
    namespace: {
      // '/': {
      //   connectionMiddleware: [ 'auth' ],
      //   packetMiddleware: [],
      // },
      '/user': {
        connectionMiddleware: [ 'user' ],
        packetMiddleware: [],
      },
      '/sys': {
        connectionMiddleware: [ 'sys' ],
        packetMiddleware: [],
      },
    },
  };

  config.static = {
    prefix: '/',
  };

  config.mongoose = {
    url: process.env.MONGODB_LINK || 'mongodb://localhost/test',
    options: {
      useFindAndModify: false,
    },
    plugins: [],
  };

  return {
    ...config,
    ...userConfig,
  };
};
