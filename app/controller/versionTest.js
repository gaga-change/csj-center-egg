'use strict';

const Controller = require('egg').Controller;
const mongoose = require('mongoose');

const Version = mongoose.model('Version', new mongoose.Schema({
  text: String,
}), 'center_version_test');

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    ctx.body = 'hi, egg';
    ctx.redirect('/index.html');
  }

  async versionTest() {
    const { ctx } = this;
    ctx.body = (await this.getVersion()).text;
  }

  async versionUpdate() {
    const { ctx } = this;
    const v = await this.getVersion();
    v.text = (ctx.query.version || '0.0.0').trim();
    await v.save();
    ctx.body = '';
  }

  async versionJS() {
    const { ctx } = this;
    const v = await this.getVersion();
    ctx.type = 'application/javascript; charset=utf-8';
    ctx.body = `var VERSION = '${v.text}'`;
  }

  async getVersion() {
    let v = await Version.findOne({});
    if (!v) {
      v = await new Version({ text: '0.0.0' }).save();
    }
    return v;
  }
}

module.exports = HomeController;
