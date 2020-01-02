

'use strict';

const BaseController = require('../core/base-controller');

class EngineStateLogController extends BaseController {
  constructor(...args) {
    super({
      modelName: 'EngineStateLog',
    }, ...args);
  }
}

module.exports = EngineStateLogController;
