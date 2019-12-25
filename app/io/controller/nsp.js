'use strict';

const Controller = require('egg').Controller;

class NspController extends Controller {
  async exchange() {
    const { ctx, app } = this;
    const message = ctx.args[0] || {};
    const socket = ctx.socket;
    const client = socket.id;

    try {
      const { namespace = '/user', target, payload } = message;
      const nsp = app.io.of(namespace);
      if (!target) return;
      const msg = ctx.helper.parseMsg('exchange', payload, { client, target });
      nsp.to(target).emit(target, msg);
    } catch (error) {
      app.logger.error(error);
    }
  }
}

module.exports = NspController;
