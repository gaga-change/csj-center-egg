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

  io.of('/sys').route('exchange', io.controller.nsp.exchange);
};
