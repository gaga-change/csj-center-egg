'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const ClientSchema = new Schema({
    clientId: String, // 客户端 ID
    connectTime: Date, // 连接时间
    lastLiveTime: Date, // 最后一次活跃时间
    room: String, // 房间号
    userId: String, // 用户 id
    username: String, // 用户名
    version: String, // 使用系统的版本号
  });

  return mongoose.model('Client', ClientSchema, 'center_client');
};

