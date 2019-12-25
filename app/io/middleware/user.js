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
    const id = socket.id;
    const nsp = app.io.of('/user');
    const nspSys = app.io.of('/sys');
    const query = socket.handshake.query;
    // 这里加一行：记录日志socket.handshake
    const address = socket.handshake.address;
    console.log(socket.handshake);
    console.log(address);
    // 用户信息
    const { room } = query;
    const rooms = [ room ];
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
    // 在线列表
    nsp.adapter.clients(rooms, (err, clients) => {
      // 更新在线用户列表
      const res = {
        room,
        clients: getClientsDetail(clients),
        action: 'join',
        message: `User(${id}) joined.`,
        client: { ...query, clientId: id },
      };
      nsp.to(room).emit('online', res);
      nspSys.emit('user room online', res);
    });
    await next();
    // 用户离开
    // 在线列表
    nsp.adapter.clients(rooms, (err, clients) => {
      // 更新在线用户列表
      const res = {
        room,
        clients: getClientsDetail(clients),
        action: 'leave',
        message: `User(${id}) leaved.`,
        client: query,
      };
      nsp.to(room).emit('online', res);
      nspSys.emit('user room online', res);
    });
  };
};
