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
    const id = socket.id;
    const nsp = app.io.of('/sys');
    const nspUser = app.io.of('/user');
    const query = socket.handshake.query;
    // 用户信息
    const { room } = query;
    /* 根据客户端id 获取详情 */
    const getClientsDetail = clients => {
      const nameSpaceLen = '/user#'.length;
      const clientArr = [];
      clients.forEach(client => {
        const _client = app.io.sockets.sockets[client.substr(nameSpaceLen)];
        if (_client) { // redis缓存里有id但当前socket服务没有响应的详情情况下跳过（有其他服务连接同一个redis，导致room共用）
          const _query = _client.handshake.query;
          clientArr.push({ ..._query, clientId: client });
        }
      });
      return clientArr;
    };
    // 用户加入
    socket.join(room);
    // 用户的在线列表
    nspUser.adapter.clients([], (err, clients) => {
      // 发送当前用户的在线列表，指定当前人员
      nsp.to(id).emit('user all online', {
        clients: getClientsDetail(clients),
      });
    });
    await next();
  };
};
