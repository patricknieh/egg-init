const jwt = require('jsonwebtoken')
const md5 = require('md5')
const handle = require('../extend/handler')
const {pagination} = require('../extend/utils')

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
    const {User} = ctx.model
    const {tags, email, username, password} = body

    try {
      if (!tags ||!email || !username || !password) ctx.throw('缺少字段')

      body.tags = []
      const result = await service.user.checkExistUserAndGetTagsId(body, tags)
      body.tags = result

      body.password = md5(password)
      await User.create(body)
      handle.success(ctx)
    } catch (e) {
      handle.error(ctx, e)
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
    const {ctx, service} = this

    try {
      const token = await service.user.generateToken()
      // ctx.cookies.set(config.TOKEN_NAME, token)
      handle.data(ctx, {token})
    } catch (e) {
      handle.error(ctx, e)
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
    const {ctx, config} = this

    try {
      // ctx.cookies.set(config.TOKEN_NAME, '')
      handle.success(ctx)
    } catch (e) {
      handle.error(ctx, e)
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
    const {ctx} = this
    const {User} = ctx.model
    const {username, email, code, newPassword} = ctx.request.body

    try {
      if (!username || !email || !code || !newPassword) ctx.throw('缺少字段')
      if (code != ctx.session.validateCode) ctx.throw('验证码不正确')

      await User.updateOne({username, email}, {password: md5(newPassword), updatedAt: Date.now()})

      handle.success(ctx)
    } catch (e) {
      handle.error(ctx, e)
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
    const {ctx, config} = this
    let {token} = ctx.params
    let {User} = ctx.model

    try {
      let decoded = await jwt.verify(token, config.keys)
      let user = await User.findById(decoded.userId, '-password')
      if (!user) ctx.throw('无记录')

      handle.data(ctx, user)
    } catch (e) {
      handle.error(ctx, e)
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
    const {ctx} = this
    const {id} = ctx.query
    const {User} = ctx.model

    try {
      let user = await User.findById(id, {name: 1, role: 1})
      if (!user) ctx.throw('无记录')

      handle.data(ctx, user)
    } catch (e) {
      handle.error(ctx, e)
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
    const body = ctx.request.body

    try {
      if (body.password) ctx.throw('包含禁止修改的字段')

      await service.user.updateUser()

      handle.success(ctx)
    } catch (e) {
      handle.error(ctx, e)
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
    const {ctx} = this
    const {username} = ctx.params
    const {User} = ctx.model

    try {
      let findUser = await User.findOne({username})
      if (!findUser) ctx.throw('用户不存在')
      if (findUser.role === '超级管理员') ctx.throw('超级管理员不允许删除')

      await User.findOneAndDelete({username})

      handle.success(ctx)
    } catch (e) {
      handle.error(ctx, e)
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
    const {ctx} = this
    const {User} = ctx.model
    const page = pagination(ctx)

    try {
      let count = await User.countDocuments(page.query)
      let users = await User.find(page.query)
        .select({password:0})
        .sort(page.sort)
        .skip(page.skip)
        .limit(page.limit)

      handle.data(ctx, users, count)
    } catch (e) {
      handle.error(ctx, e)
    }
  }
}

module.exports = UserController
