const jwt = require('jsonwebtoken')
const N = require('../../tools/net')
const appConfig = require('../../config/app.config')

module.exports = options => {
  return async function isUser(ctx, next) {
    // 可以从cookie里面获得token，也可以从request header里获取token
    const token = ctx.cookies.get('token') ? ctx.cookies.get('token') : N.getCookieValue(ctx.header.cookie,'token')

    try {
      if(!token) ctx.throw('Please login')
      const decoded = jwt.verify(token, appConfig.secret)
      const username = decoded.userName
      const id = decoded.userId
      if(!username || !id) ctx.throw('Verify token fail')

      let user = await ctx.model.User.findOne({ _id:id, username })
      if (!user) ctx.throw('Token invalid')

      await next()
    } catch (e) {
      ctx.helper.error(ctx,e)
    }
  };
};
