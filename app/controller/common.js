const gtSlide = require('../public/js/gt-slide')
const N = require('../../tools/number')
const fs = require('mz/fs')
const path = require('path')
const pump = require('mz-modules/pump')

const Controller = require('egg').Controller
class CommonController extends Controller {
  /**
   * @api {post} /uploadFile 01.文件上传
   * @apiSampleRequest /uploadFile
   * @apiName uploadFile
   * @apiGroup Common
   * @apiPermission none
   * @apiVersion 0.1.0
   *
   * @apiSuccess {Array} fields  字段属性
   * @apiSuccess {Array} files  文件列表
   * @apiUse error
   */
  async uploadFile() {
    const { ctx, config } = this;
    const files = ctx.request.files
    const body = ctx.request.body

    let fields = []
    let filesRes = []
    try {
      for (const file of files) {
        const filename = file.filename.toLowerCase();
        const targetPath = path.join(config.baseDir, 'app/public/files', filename)
        const source = fs.createReadStream(file.filepath)
        const target = fs.createWriteStream(targetPath)
        await pump(source, target)
        file.filepath = `/public/files/${filename}`
        filesRes.push(file)
      }

      for (const k in body) {
        fields.push({
          key: k,
          value: ctx.request.body[k],
        })
      }

      ctx.helper.data(ctx,{fields, files:filesRes})
    }catch (e) {
      ctx.helper.error(ctx,e)
    }finally {
      // delete those request tmp files
      await ctx.cleanupRequestFiles()
    }
  }
  /**
   * @api {post} /getCode 02.获取验证码
   * @apiSampleRequest /getCode
   * @apiName getCode
   * @apiGroup Common
   * @apiPermission none
   * @apiVersion 0.1.0
   *
   * @apiParam {String} username   用户名称
   * @apiParam {String} email   邮箱
   *
   * @apiUse success
   * @apiUse error
   */
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
  /**
   * @api {post} /sendEmail 03.发送邮件
   * @apiSampleRequest /sendEmail
   * @apiName sendEmail
   * @apiGroup Common
   * @apiPermission none
   * @apiVersion 0.1.0
   *
   * @apiParam {String} to   目标邮箱
   * @apiParam {String} subject   主题
   * @apiParam {String} html   HTML代码
   *
   * @apiUse success
   * @apiUse error
   */
  async sendEmail() {
    const {ctx,config} = this
    const {to,subject,html} = ctx.request.body

    try{
      if(!to || !subject || !html) ctx.throw('缺少字段')
      let res = await ctx.helper.sendMail(config,to,subject,html)
      ctx.helper.data(ctx,res)
    }catch (e) {
      ctx.helper.error(ctx,e)
    }
  }
  /**
   * @api {post} /gt3 04.极验验证
   * @apiSampleRequest /gt3
   * @apiName gtRegister
   * @apiGroup Common
   * @apiPermission none
   * @apiVersion 0.1.0
   *
   * @apiUse success
   * @apiUse error
   */
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
module.exports = CommonController
