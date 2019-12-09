'use strict';

/** @type Egg.EggPlugin */
module.exports = {
  static: {
    enable: true,
  },
  io: {
    enable: true,
    package: 'egg-socket.io',
  },
};
