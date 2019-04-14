const promiseAsync = require('promise-async')

const Controller = require('egg').Controller
class controller extends Controller {
  async post() {
    const {ctx, service} = this
    const body = ctx.request.body
    const {tags,user} = body

    try {
      if(!tags || !user) ctx.throw('缺少字段')

      // 查询标签集合，没有就插入新标签
      // 查询出该文章所有标签的id
      body.tags = []

      await promiseAsync.each(tags,async (item,callback) => {
        let tag = await ctx.model.Tag.findOneAndUpdate({name: item},{name: item},{new: true,upsert: true,setDefaultsOnInsert:true})
        body.tags.push(tag._id)
        callback()   //very important
      })

      await ctx.model.Article.create(body)
      ctx.helper.success(ctx)
    } catch (e) {
      ctx.helper.error(ctx, e)
    }
  }

  async get() {
    const {ctx, service} = this
    const {id} = ctx.params

    try {
      let record = await ctx.model.Article.findById(id)
        .populate({
          path:'tags',
          select: 'name'
        })
        .populate({
          path:'user',
          select: 'name'
        })
        .exec()

      await ctx.model.Article.findByIdAndUpdate(id,{view:record.view + 1})

      let preArticle = await ctx.model.Article.find({ 'createdAt': { '$lt': record.createdAt } })
        .select('title')
        .sort({_id: -1})
        .limit(1)
      let nextArticle = await ctx.model.Article.find({ 'createdAt': { '$gt': record.createdAt } })
        .select('title')
        .sort({_id: 1})
        .limit(1)

      let temp = {}
      let pre = preArticle[0] ? preArticle[0] : {}
      let next = nextArticle[0] ? nextArticle[0] : {}

      let result = Object.assign(temp,record._doc,{pre},{next})
      ctx.helper.data(ctx, result)
    } catch (e) {
      ctx.helper.error(ctx, e)
    }
  }

  async patch() {
    const {ctx, service} = this
    const body = ctx.request.body
    const {user,tags} = body
    const {id} = ctx.params

    try {
      if(user) ctx.throw('禁止修改字段')

      body.tags = []
      await promiseAsync.each(tags,async (item,callback) => {
        let tag = await ctx.model.Tag.findOneAndUpdate({name: item},{name: item},{new: true,upsert: true,setDefaultsOnInsert:true})
        body.tags.push(tag._id)
        callback()
      })

      body.updatedAt = Date.now()
      let res = await ctx.model.Article.findByIdAndUpdate(id,body)
      if(!res) ctx.throw('无记录')
      ctx.helper.success(ctx)
    } catch (e) {
      ctx.helper.error(ctx, e)
    }
  }

  async del() {
    const {ctx, service} = this
    const {id} = ctx.params

    try{
      let res = await ctx.model.Article.findByIdAndDelete(id)
      if(!res) ctx.throw('无记录')
      ctx.helper.success(ctx)
    }catch (e) {
      ctx.helper.error(ctx, e)
    }
  }

  async list() {
    const {ctx, service} = this
    const page = ctx.helper.pagination(ctx)

    try{
      let count = await ctx.model.Article.countDocuments(page.query)
      let records = await ctx.model.Article.find(page.query)
        .populate({
          path:'user',
          select: 'name'
        })
        .populate({
          path:'tags',
          select: 'name'
        })
        .sort(page.sort)
        .skip(page.skip)
        .limit(page.limit)
        .exec()
      ctx.helper.data(ctx,records,count)
    }catch (e) {
      ctx.helper.error(ctx, e)
    }
  }

  async listBySearch() {
    const {ctx, service} = this
    const page = ctx.helper.pagination(ctx)
    const { keyword } = ctx.params
    const reg = new RegExp(decodeURIComponent(keyword), 'i')
    const conditions = {$or: [{ title: { $regex: reg } }, { content: { $regex: reg } }]}

    try{
      let count = await ctx.model.Article.count(conditions)
      let records = await ctx.model.Article.find(conditions)
        .populate({
          path:'user',
          select: 'name'
        })
        .populate({
          path:'tags',
          select: 'name'
        })
        .sort(page.sort)
        .skip(page.skip)
        .limit(page.limit)
        .exec()
      ctx.helper.data(ctx,records,count)
    }catch (e) {
      ctx.helper.error(ctx, e)
    }
  }

  async listByTag() {
    const {ctx, service} = this
    const page = ctx.helper.pagination(ctx)
    const { tag } = ctx.params

    try{
      let record = await ctx.model.Tag.find({name: tag})
      let conditions = { tags: {$all:[record[0]._id]} }
      let count = await ctx.model.Article.countDocuments(Object.assign(conditions,page.query))
      let records = await ctx.model.Article.find(Object.assign(conditions,page.query))
        .populate({
          path:'user',
          select: 'name'
        })
        .populate({
          path:'tags',
          select: 'name'
        })
        .sort(page.sort)
        .skip(page.skip)
        .limit(page.limit)
        .exec()
      ctx.helper.data(ctx,records,count)
    }catch (e) {
      ctx.helper.error(ctx, e)
    }
  }

  async listByTagId() {
    const {ctx, service} = this
    const page = ctx.helper.pagination(ctx)
    const { tagId } = ctx.params
    const conditions = { tags: {$all:[tagId]} }

    try{
      let count = await ctx.model.Article.countDocuments(Object.assign(conditions,page.query))
      let records = await ctx.model.Article.find(Object.assign(conditions,page.query))
        .populate({
          path:'user',
          select: 'name'
        })
        .populate({
          path:'tags',
          select: 'name'
        })
        .sort(page.sort)
        .skip(page.skip)
        .limit(page.limit)
        .exec()
      ctx.helper.data(ctx,records,count)
    }catch (e) {
      ctx.helper.error(ctx, e)
    }
  }

}

module.exports = controller
