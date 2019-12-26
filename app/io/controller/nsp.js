'use strict';

const Controller = require('egg').Controller;

class NspController extends Controller {
  async exchange() {
    const { ctx, app } = this;
    const message = ctx.args[0] || {};
    const socket = ctx.socket;
    const client = socket.id;

    try {
      const { namespace = '/user', target, action, payload } = message;
      const nsp = app.io.of(namespace);
      if (!target || !action) return;
      const msg = ctx.helper.parseMsg(action, payload, { client, target });
      nsp.to(target).emit('exchange', msg);
    } catch (error) {
      app.logger.error(error);
    }
  }
}

module.exports = NspController;
