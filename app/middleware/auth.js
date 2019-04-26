const jwt = require('jsonwebtoken')
const handle = require('../extend/handler')
const {utils} = require('web-base')

module.exports = (options, app) => {
  return async function isUser(ctx, next) {
    // 可以从cookie里面获得token，也可以从request header里获取token
    const token = ctx.header.cookie ? utils.cookie.getFromString(ctx.header.cookie,app.config.TOKEN_NAME) : ctx.cookies.get(app.config.TOKEN_NAME)

    try {
      if(!token) ctx.throw('Please login')
      const decoded = jwt.verify(token, app.config.keys)
      const username = decoded.userName
      const id = decoded.userId
      if(!username || !id) ctx.throw('Verify token fail')

      let user = await ctx.model.User.findOne({ _id:id, username })
      if (!user) ctx.throw('Token invalid')

      if(options.target === 'admin'){
        if (user.role != '超级管理员') ctx.throw('你不是超级管理员')
      }

      await next()
    } catch (e) {
      handle.error(ctx, e)
    }
  };
};
