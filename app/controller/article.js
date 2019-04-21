const {action} = require('../extend/utils')

const Controller = require('egg').Controller
class ArticleController extends Controller {
  async createArticle() {
    const {ctx, service} = this
    const result = await service.article.createArticle()
    action(ctx, result)
  }

  async getArticle() {
    const {ctx, service} = this
    const result = await service.article.getArticle()
    action(ctx, result)
  }

  async updateArticle() {
    const {ctx, service} = this
    const result = await service.article.updateArticle()
    action(ctx, result)
  }

  async delArticle() {
    const {ctx, service} = this
    const result = await service.article.delArticle()
    action(ctx, result)
  }

  async listArticle() {
    const {ctx, service} = this
    const result = await service.article.listArticle()
    action(ctx, result)
  }

  async listArticleBySearch() {
    const {ctx, service} = this
    const result = await service.article.listArticleBySearch()
    action(ctx, result)
  }

  async listArticleByTag() {
    const {ctx, service} = this
    const result = await service.article.listArticleByTag()
    action(ctx, result)
  }

  async listArticleByTagId() {
    const {ctx, service} = this
    const result = await service.article.listArticleByTagId()
    action(ctx, result)
  }

}

module.exports = ArticleController
