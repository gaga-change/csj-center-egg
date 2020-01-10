import('./lib').then(({ $, io }) => {
  const log = console.log;

  log('当前版本', VERSION)

  var version = VERSION
  $('#version').html(version)
  $('#host').html(location.host)
  $('#updateBtn').click(e => {
    let temp = version.split('.')
    temp[temp.length - 1] = Number(temp[temp.length - 1]) + 1
    val = temp.join('.')
    $('#newVersion').val(val)
    $.get(`/versionUpdate?version=${val}`)
  })

  const socket = io('/user', {
    // 实际使用中可以在这里传递参数
    query: {
      room: location.host,
      userId: `client_${Math.random()}`,
      username: `client_${Math.random()}`,
      version: version,
    },
    transports: ['websocket']
  });
  socket.on('connect', () => {
    const id = socket.id;
    log('#connect,', id, socket);
  });
  socket.on('exchange', msg => {
    log(msg)
    const { meta, data } = msg
    const { action, payload } = data
    if (action === 'version update') {
      console.log('新版本', payload.version)
      if (version !== payload.version) {
        version = payload.version
        console.log('提示：版本更新')
      }
    }
  })
  // 接收在线用户信息
  socket.on('online', msg => {
    log('#online,', msg);
  });
  // 系统事件
  socket.on('disconnect', msg => {
    log('#disconnect', msg);
  });

  socket.on('disconnecting', () => {
    log('#disconnecting');
  });

  socket.on('error', () => {
    log('#error');
  });
  function live() {
    let tick = null
    let temp = function () {
      tick = setTimeout(() => {
        console.log('执行', Date.now())
        socket.emit('living')
        tick = null
      }, 1000)
    }
    document.addEventListener('click', (e) => {
      if (tick) {
        return
      } else {
        temp()
      }
    })
  }
  live()
})



