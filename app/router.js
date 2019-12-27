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

  io.of('/sys').route('exchange', io.controller.nsp.exchange);
};
