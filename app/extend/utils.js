const handle = require('../extend/handler')
module.exports = {
  getModelOptions() {
    return {
      toJSON: {
        virtuals: true,
        versionKey: false,
        transform(doc, ret) {
          delete ret._id
          return ret
        }
      }
    }
  },
  async action(ctx,result){
    try {
      if(result.type === 'data') handle.data(ctx,result.data,result.total)
      if(result.type === 'success') handle.success(ctx)
    } catch (e) {
      if(e) handle.error(ctx, e)
      if(result.type === 'message') handle.error(ctx, result.message)
    }
  }
}
