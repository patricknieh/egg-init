const jwt = require('jsonwebtoken')
const md5 = require('md5')
const gtSlide = require('../extend/gt-slide')
const promiseAsync = require('promise-async')

const Controller = require('egg').Controller
class UserController extends Controller {
  /**
   * @api {post} /user 01.用户注册
   * @apiSampleRequest /user
   * @apiName register
   * @apiGroup User
   * @apiPermission none
   * @apiVersion 0.1.0
   *
   * @apiParam {Array} tags     标签
   * @apiParam {String} email     邮箱
   * @apiParam {String} username  用户名
   * @apiParam {String} password  密码
   *
   * @apiUse success
   * @apiUse error
   */
  async register() {
    const {ctx, service} = this
    const body = ctx.request.body
    const {tags, email, username, password} = body

    try {
      if (!tags ||!email || !username || !password) ctx.throw('缺少字段')

      body.tags = []
      await promiseAsync.each(tags,async (item,callback) => {
        let tag = await ctx.model.Tag.findOneAndUpdate({name: item},{name: item},{new: true,upsert: true,setDefaultsOnInsert:true})
        console.log('tag id: ',tag._id)

        let err = null
        try {
          let emailRecord = await service.user.findOne({email})
          if(emailRecord){
            emailRecord.tags.forEach(i => {
              if(String(i._id) === String(tag._id)) ctx.throw('此邮箱已经注册过，如忘记密码请重置密码')
            })
          }

          let usernameRecord = await service.user.findOne({username})
          if(usernameRecord){
            usernameRecord.tags.forEach(i => {
              if(String(i._id) === String(tag._id)) ctx.throw('此用户名已被使用，换一个再试试')
            })
          }
        }catch (e) {
          callback(e) //important
          err = true
        }

        body.tags.push(tag._id)
        if(!err) callback()
      })

      body.password = md5(password)
      await service.user.create(body)
      ctx.helper.success(ctx)
    } catch (e) {
      ctx.helper.error(ctx, e)
    }
  }
  /**
   * @api {post} /user/login 02.用户登录
   * @apiSampleRequest /user/login
   * @apiName login
   * @apiGroup User
   * @apiPermission 极验
   * @apiVersion 0.1.0
   *
   * @apiParam {String} username  用户名
   * @apiParam {String} password  密码
   * @apiParam {String} geetest_challenge  极验参数
   * @apiParam {String} geetest_validate  极验参数
   * @apiParam {String} geetest_seccode  极验参数
   *
   * @apiUse data
   * @apiSuccess {String} data.token token
   * @apiUse error
   */
  async login() {
    const {ctx, service, config} = this
    let {username, password, geetest_challenge, geetest_validate, geetest_seccode} = ctx.request.body
    password = md5(password)

    try {
      // 对ajax提供的验证凭证进行二次验证
      let success = await gtSlide.validate(ctx.session.failback, {
        geetest_challenge,
        geetest_validate,
        geetest_seccode
      })
      if (!success) ctx.throw('GT 验证失败')
      // 验证用户
      let user = await service.user.findOne({username, password})
      if (!user) ctx.throw('用户名或密码错')

      let token = jwt.sign({userId: user.id, userName: user.username}, config.keys)
      // ctx.cookies.set(config.TOKEN_NAME, token)
      ctx.helper.data(ctx, {token})
    } catch (e) {
      ctx.helper.error(ctx, e)
    }
  }
  /**
   * @api {post} /user/logout 03.用户登出
   * @apiSampleRequest /user/logout
   * @apiName logout
   * @apiGroup User
   * @apiPermission none
   * @apiVersion 0.1.0
   *
   * @apiUse success
   * @apiUse error
   */
  async logout() {
    const {ctx, service, config} = this

    try {
      ctx.cookies.set(config.TOKEN_NAME, '')
      ctx.helper.success(ctx)
    } catch (e) {
      ctx.helper.error(ctx, e)
    }
  }
  /**
   * @api {post} /user/resetPassword 04.重置密码
   * @apiSampleRequest /user/resetPassword
   * @apiName resetPassword
   * @apiGroup User
   * @apiPermission none
   * @apiVersion 0.1.0
   *
   * @apiParam {String} username  用户名
   * @apiParam {String} email  邮箱
   * @apiParam {String} code  验证码
   * @apiParam {String} newPassword  新密码
   *
   * @apiUse success
   * @apiUse error
   */
  async resetPassword() {
    const {ctx, service} = this
    const {username, email, code, newPassword} = ctx.request.body

    try {
      if (!username || !email || !code || !newPassword) ctx.throw('缺少字段')
      if (code != ctx.session.validateCode) ctx.throw('验证码不正确')

      await service.user.updateOne({username, email}, {password: md5(newPassword), updatedAt: Date.now()})
      ctx.helper.success(ctx)
    } catch (e) {
      ctx.helper.error(ctx, e)
    }
  }
  /**
   * @api {get} /user/:token 05.获取用户信息
   * @apiSampleRequest /user/:token
   * @apiName getUserInfo
   * @apiGroup User
   * @apiPermission none
   * @apiVersion 0.1.0
   *
   * @apiUse data
   * @apiUse SuccessUserModel
   * @apiUse error
   */
  async getUserInfoByToken() {
    const {ctx, service, config} = this
    let {token} = ctx.params

    try {
      let decoded = await jwt.verify(token, config.keys)
      let user = await service.user.findById(decoded.userId, '-password')
      if (!user) ctx.throw('无记录')
      ctx.helper.data(ctx, user)
    } catch (e) {
      ctx.helper.error(ctx, e)
    }
  }
  /**
   * @api {get} /user 06.通过id获取用户信息
   * @apiSampleRequest /user?id=
   * @apiName getUserInfoById
   * @apiGroup User
   * @apiPermission none
   * @apiVersion 0.1.0
   *
   * @apiUse data
   * @apiUse SuccessUserModel
   * @apiUse error
   */
  async getUserInfoById() {
    const {ctx, service} = this
    const {id} = ctx.query

    try {
      let user = await service.user.findById(id, {name: 1, role: 1})
      if (!user) ctx.throw('无记录')
      ctx.helper.data(ctx, user)
    } catch (e) {
      ctx.helper.error(ctx, e)
    }
  }
  /**
   * @api {patch} /user/:id 07.修改用户信息
   * @apiSampleRequest /user/:id
   * @apiName patchUserInfo
   * @apiGroup User
   * @apiPermission none
   * @apiVersion 0.1.0
   *
   * @apiUse ParamUserModel
   *
   * @apiUse success
   * @apiUse error
   */
  async patchUserInfo() {
    const {ctx, service} = this
    const {id} = ctx.params
    const body = ctx.request.body

    try {
      if (body.password) ctx.throw('包含禁止修改的字段')

      let user = await service.user.findById(id)
      if (!user) ctx.throw('用户不存在')
      if (user.role === '超级管理员') ctx.throw('超级管理员不允许修改')

      //修改密码
      if (body.oldPassword && body.newPassword) {
        if (user.password !== md5(body.oldPassword)) ctx.throw('原密码不正确')
        await service.user.findByIdAndUpdate(id, {password: md5(body.newPassword), updatedAt: Date.now()})
      } else {
        if (body.role === '超级管理员') ctx.throw('超级管理员只能有一个')
        //修改其他信息
        body.updatedAt = Date.now()
        await service.user.findByIdAndUpdate(id, body)
      }
      ctx.helper.success(ctx)
    } catch (e) {
      ctx.helper.error(ctx, e)
    }
  }
  /**
   * @api {delete} /user/:username 08.删除用户
   * @apiSampleRequest /user/:username
   * @apiName deleteUser
   * @apiGroup User
   * @apiPermission admin
   * @apiVersion 0.1.0
   *
   * @apiUse success
   * @apiUse error
   */
  async deleteUser() {
    const {ctx, service} = this
    const {username} = ctx.params

    try {
      let findUser = await service.user.findOne({username})
      if (!findUser) ctx.throw('用户不存在')
      if (findUser.role === '超级管理员') ctx.throw('超级管理员不允许删除')
      await service.user.findOneAndDelete({username})
      ctx.helper.success(ctx)
    } catch (e) {
      ctx.helper.error(ctx, e)
    }
  }
  /**
   * @api {get} /users 09.获取所有用户
   * @apiSampleRequest /users
   * @apiName list
   * @apiGroup User
   * @apiPermission none
   * @apiVersion 0.1.0
   *
   * @apiUse dataArr
   * @apiUse SuccessUserModel
   * @apiUse error
   */
  async listUser() {
    const {ctx, service} = this
    const page = ctx.helper.pagination(ctx)

    try {
      let count = await service.user.countDocuments(page.query)
      let users = await service.user.find(page.query, page)
      ctx.helper.data(ctx, users, count)
    } catch (e) {
      ctx.helper.error(ctx, e)
    }
  }
}

module.exports = UserController
