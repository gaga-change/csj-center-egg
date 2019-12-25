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

  return {
    ...config,
    ...userConfig,
  };
};
