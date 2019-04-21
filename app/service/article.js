const promiseAsync = require('promise-async')

const Service = require('egg').Service
class ArticleService extends Service {
  async createArticle() {
    const {ctx} = this
    const body = ctx.request.body
    const {tags,user} = body

    if(!tags || !user) ctx.throw('缺少字段')

    body.tags = []
    await promiseAsync.each(tags,async (item,callback) => {
      let tag = await ctx.model.Tag.findOneAndUpdate({name: item},{name: item},{new: true,upsert: true,setDefaultsOnInsert:true})
      body.tags.push(tag._id)
      callback() //important
    })

    await ctx.model.Article.create(body)

    return{
      type: 'success'
    }
  }
}

module.exports = ArticleService
