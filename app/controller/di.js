const request = require('superagent')

const Controller = require('egg').Controller;
class controller extends Controller {
  async getToken() {
    const {ctx, config} = this

    try {
      let res = await request.get(config.superagent.access_token_url);
      ctx.helper.data(ctx, res.text)
    } catch (e) {
      ctx.helper.error(ctx, e)
    }
  }
}

module.exports = controller;
