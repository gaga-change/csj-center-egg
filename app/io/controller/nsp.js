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

  async living() {
    const { ctx, app } = this;
    const socket = ctx.socket;
    const id = socket.id;
    const client = await ctx.model.Client.findOneAndUpdate({ clientId: id }, { lastLiveTime: Date.now() }, { new: true });
    // if (!client) {
    //   app.logger.error('living 异常：客户端未找到');
    //   return;
    // }
    const nspSys = app.io.of('/sys');
    nspSys.to('center').emit('on living', client);
  }
}

module.exports = NspController;
