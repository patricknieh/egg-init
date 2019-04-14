const Controller = require('egg').Controller
class controller extends Controller {
  async list() {
    const {ctx, service} = this
    const query = ctx.query

    try {
      let records = await ctx.model.Tag.find(query)
        .sort({ 'updatedAt': -1 })
        .exec()
      ctx.helper.data(ctx, records)
    } catch (e) {
      ctx.helper.error(ctx, e)
    }
  }

}

module.exports = controller
