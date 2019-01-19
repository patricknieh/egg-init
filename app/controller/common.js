const gtSlide = require('../public/js/gt-slide')
const N = require('../../tools/number')

const Controller = require('egg').Controller;
class controller extends Controller {
  async uploadThumb() {
    const {ctx} = this

    try {
      ctx.helper.filePath(ctx,'/thumb')
    }catch (e) {
      ctx.helper.error(ctx,e)
    }
  }

  async getCode() {
    const {ctx} = this
    const {username,email} = ctx.request.body

    try{
      if(!username || !email) ctx.throw('缺少字段')
      let user = await ctx.model.User.findOne({username, email})
      if(!user) ctx.throw('用户名和邮箱不匹配')

      let n = ctx.session.views || 0
      ctx.session.views = ++n
      if(ctx.session.views > 3) ctx.throw('获取验证码太频繁，请10分钟后再试！')

      let code = N.randomCode(6)
      ctx.session.validateCode = code
      let html = `<div>验证码： <span style="font-size: 20px;color:#ff4c29;">${code}</span> 10分钟内有效</div>`
      await ctx.helper.sendMail(email,'获取验证码',html)
      ctx.helper.success(ctx)
    }catch (e) {
      ctx.helper.error(ctx,e)
    }
  }

  async sendEmail() {
    const {ctx} = this
    const {to,subject,html} = ctx.request.body

    try{
      if(!to || !subject || !html) ctx.throw('缺少字段')
      let res = await ctx.helper.sendMail(to,subject,html)
      ctx.helper.data(ctx,res)
    }catch (e) {
      ctx.helper.error(ctx,e)
    }
  }

  async gtRegister() {
    const {ctx} = this

    try{
      // 向极验申请每次验证所需的challenge
      let res = await gtSlide.register(null)
      if(!res.success){
        // 进入 failback，如果一直进入此模式，请检查服务器到极验服务器是否可访问
        ctx.session.failback = true
        ctx.body = res
      }else {
        // 正常模式
        ctx.session.failback = false
        ctx.body = res
      }
    }catch (e) {
      ctx.body = e
    }
  }
}
module.exports = controller;
