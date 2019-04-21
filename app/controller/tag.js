const {handle} = require('../extend/utils')

const Controller = require('egg').Controller
class TagController extends Controller {
  async listTag() {
    const {ctx} = this
    const query = ctx.query
    const {Tag} = ctx.model

    try {
      let records = await Tag.find(query)
        .sort({ 'updatedAt': -1 })

      handle.data(ctx, records)
    } catch (e) {
      handle.error(ctx, e)
    }
  }
}

module.exports = TagController
