const promiseAsync = require('promise-async')
const gtSlide = require('../extend/gt-slide')
const md5 = require('md5')

const Service = require('egg').Service
class UserService extends Service {
  async checkExistUserAndGetTagsId (body,tags) {
    const {ctx} = this
    const {Tag,User} = ctx.model

    let result = []
    await promiseAsync.each(tags,async (item,callback) => {
      let tag = await Tag.findOneAndUpdate({name: item},{name: item},{new: true,upsert: true,setDefaultsOnInsert:true})

      let err = null
      try {
        let emailRecord = await User.findOne({email})
        if(emailRecord){
          emailRecord.tags.forEach(i => {
            if(String(i._id) === String(tag._id)) ctx.throw('此邮箱已经注册过，如忘记密码请重置密码')
          })
        }

        let usernameRecord = await User.findOne({username})
        if(usernameRecord){
          usernameRecord.tags.forEach(i => {
            if(String(i._id) === String(tag._id)) ctx.throw('此用户名已被使用，换一个再试试')
          })
        }
      }catch (e) {
        callback(e) //important
        err = true
      }

      result.push(tag._id)
      if(!err) callback()
    })

    return result
  }

  async generateToken () {
    const {ctx, config} = this
    const {User} = ctx.model
    let {username, password, geetest_challenge, geetest_validate, geetest_seccode} = ctx.request.body

    password = md5(password)

    // 对ajax提供的验证凭证进行二次验证
    let success = await gtSlide.validate(ctx.session.failback, {
      geetest_challenge,
      geetest_validate,
      geetest_seccode
    })

    if (!success) ctx.throw('GT 验证失败')

    // 验证用户
    let user = await User.findOne({username, password})
    if (!user) ctx.throw('用户名或密码错')

    let token = jwt.sign({userId: user.id, userName: user.username}, config.keys)

    return token
  }

  async updateUser () {
    const {ctx} = this
    const {id} = ctx.params
    const {User} = ctx.model
    const body = ctx.request.body

    let user = await User.findById(id)
    if (!user) ctx.throw('用户不存在')
    if (user.role === '超级管理员') ctx.throw('超级管理员不允许修改')

    //修改密码
    if (body.oldPassword && body.newPassword) {
      if (user.password !== md5(body.oldPassword)) ctx.throw('原密码不正确')
      await User.findByIdAndUpdate(id, {password: md5(body.newPassword), updatedAt: Date.now()})
    } else {
      if (body.role === '超级管理员') ctx.throw('超级管理员只能有一个')
      //修改其他信息
      body.updatedAt = Date.now()
      await User.findByIdAndUpdate(id, body)
    }
  }
}

module.exports = UserService
