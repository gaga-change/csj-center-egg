'use strict';

/*
客户端监听：
  sys监听
    user all online: 当前所有/user空间下的客户端发送过来
      clients<Array>
*/

module.exports = () => {
  return async (ctx, next) => {
    const { app, socket } = ctx;
    const { Client } = ctx.model;
    const id = socket.id;
    const nsp = app.io.of('/sys');
    const nspUser = app.io.of('/user');
    const query = socket.handshake.query;
    // 用户信息
    const { room } = query;
    // 用户加入
    socket.join(room);
    // 用户的在线列表
    nspUser.adapter.clients([], async (err, clientIds) => {
      const clients = await Client.find({ clientId: { $in: clientIds } }).sort('-lastLiveTime');
      await Client.deleteMany({ clientId: { $nin: clientIds } });
      // 发送当前用户的在线列表，指定当前人员
      nsp.to(id).emit('user all online', {
        meta: { timestamp: Date.now() },
        clients,
      });
    });
    await next();
  };
};
