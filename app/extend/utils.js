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
  },
  async list(model,page,conditions) {
    let count,records
    if(conditions){
      count = await Article.count(conditions)
      records = await Article.find(conditions)
        .sort(page.sort)
        .skip(page.skip)
        .limit(page.limit)
    }else {
      count = await model.countDocuments(page.query)
      records = await model.find(page.query)
        .sort(page.sort)
        .skip(page.skip)
        .limit(page.limit)
    }
    return{count,records}

  },
  pagination(ctx) {
    let query = ctx.query
    let {pageIndex = 1, pageSize = 100, pageSort = 'createdAt'} = query
    let skip = (Number(pageIndex) - 1) * Number(pageSize)
    let limit = Number(pageSize)
    let sort = {}
    sort[pageSort] = -1
    delete query.pageIndex
    delete query.pageSize
    delete query.pageSort
    return {
      query,
      skip,
      limit,
      sort
    }
  },
}
