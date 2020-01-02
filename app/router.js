'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, io } = app;
  router.get('/', controller.home.index);
  router.get('/version.txt', controller.versionTest.versionTest);
  router.get('/versionUpdate', controller.versionTest.versionUpdate);
  router.get('/version.js', controller.versionTest.versionJS);

  router.resources('/api/roomVersionLog', controller.roomVersionLog);
  router.post('/api/roomVersionLog/save', controller.roomVersionLog.save);

  router.resources('/api/roomOnlineLog', controller.roomOnlineLog);
  router.post('/api/roomOnlineLog/save', controller.roomOnlineLog.save);

  router.get('/api/engineState/save', controller.engineState.save);
  router.resources('/api/engineState', controller.engineState);

  router.resources('/api/engineStateLog', controller.engineStateLog);

  io.of('/sys').route('exchange', io.controller.nsp.exchange);
  io.of('/user').route('living', io.controller.nsp.living);
};
