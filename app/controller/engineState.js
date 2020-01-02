

'use strict';

const BaseController = require('../core/base-controller');

class EngineStateController extends BaseController {
  constructor(...args) {
    super({
      modelName: 'EngineState',
    }, ...args);
  }

  /** 保存该域最新被使用的系统版本 */
  async save() {
    const { ctx } = this;
    const { EngineStateLog, EngineState } = ctx.model;
    const item = ctx.request.query;
    await EngineState.updateOne({ ip: item.ip }, { ...item }, { upsert: true });
    this.success(await new EngineStateLog(item).save());
  }
}

module.exports = EngineStateController;
