const Service = require('egg').Service
class ArticleService extends Service {
  //新增
  async create(body) {
    return this.ctx.model.User.create(body)
  }
}

module.exports = ArticleService
