'use strict';

/*
客户端监听：
  sys监听
    user room online: 发送/user空间下指定房间的客户端
      clients<Array>
      room
      action['leave','join'] 加入或离开
      client  触发者
  user监听
    online: 发送当前房间下的所有客户端
      clients<Array>
      room
      action['leave','join'] 加入或离开
      client  触发者
*/

module.exports = () => {
  return async (ctx, next) => {
    const { app, socket } = ctx;
    const { Client } = ctx.model;
    const id = socket.id;
    const nspSys = app.io.of('/sys');
    const query = socket.handshake.query;
    // 用户信息
    const { room } = query;
    // 存储用户信息倒数据库
    const client = await new Client({ clientId: id, ...query, connectTime: Date.now(), lastLiveTime: Date.now() }).save();
    // 用户加入
    socket.join(room);
    // 通知 /sys 下的连接，房间人员变动
    nspSys.emit('user room online', { meta: { timestamp: Date.now() }, room, action: 'join', client });
    await next();
    // 修改最后一次活跃时间
    client.lastLiveTime = Date.now();
    // 通知 /sys 下的连接，房间人员变动
    nspSys.emit('user room online', { meta: { timestamp: Date.now() }, room, action: 'leave', client });
    // 用户离开，删除数据库中的信息
    await Client.deleteMany({ clientId: id });
  };
};
