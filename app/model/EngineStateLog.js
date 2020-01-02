'use strict';

/*
  监控主机磁盘&内存信息
*/

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const EngineStateLogSchema = new Schema({
    ip: String,
    remark: String,
    memoryTotal: Number,
    memoryUsed: Number,
    diskTotal: Number,
    diskUsed: Number,
  }, { timestamps: true });

  return mongoose.model('EngineStateLog', EngineStateLogSchema, 'center_engine_state_log');
};
