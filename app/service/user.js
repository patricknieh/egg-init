const Service = require('egg').Service;

class service extends Service {
  //新增
  async create(body) {
    return this.ctx.model.User.create(body)
  }

  //删除
  async findOneAndDelete(condition) {
    return this.ctx.model.User.findOneAndDelete(condition)
  }

  //查询
  async findById(id,option) {
    return this.ctx.model.User.findById(id,option)
  }
  async findOne(condition) {
    return this.ctx.model.User.findOne(condition)
  }
  async find(condition,page) {
    return this.ctx.model.User.find(condition)
      .select({password:0})
      .sort(page.sort)
      .skip(page.skip)
      .limit(page.limit)
  }

  //更新
  async updateOne(condition,body) {
    return this.ctx.model.User.updateOne(condition, body)
  }
  async findByIdAndUpdate(id,body) {
    return this.ctx.model.User.findByIdAndUpdate(id, body)
  }

  //统计
  async countDocuments(condition) {
    return this.ctx.model.User.countDocuments(condition)
  }
}

module.exports = service;
