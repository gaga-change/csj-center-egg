

'use strict';

const BaseController = require('../core/base-controller');

class RoomVersionLogController extends BaseController {
  constructor(...args) {
    super({
      modelName: 'RoomVersionLog',
    }, ...args);
  }

  /** 保存该域最新被使用的系统版本 */
  async save() {
    const { ctx } = this;
    const item = ctx.request.body;
    const { room, version } = item;
    ctx.assert(room && version, 400, 'room version 参数必填');
    this.success(await ctx.model.RoomVersionLog.updateOne({ room, version }, {}, { upsert: true }));
  }

}

module.exports = RoomVersionLogController;
