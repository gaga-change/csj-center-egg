

'use strict';

const BaseController = require('../core/base-controller');

class RoomOnlineLogController extends BaseController {
  constructor(...args) {
    super({
      modelName: 'RoomOnlineLog',
    }, ...args);
  }

  /** 保存该域下当前在线人员 */
  async save() {
    const { ctx } = this;
    const item = ctx.request.body;
    const { room, clients, timestamp } = item;
    ctx.assert(room && clients && timestamp, 400, 'room clients timestamp 参数必填');
    const date = new Date(timestamp);
    date.setMilliseconds(0);
    this.success(await ctx.model.RoomOnlineLog.updateOne({ room, date }, {
      room,
      clients,
      clientsNum: clients.length,
      date,
    }, { upsert: true }));
  }

}

module.exports = RoomOnlineLogController;
