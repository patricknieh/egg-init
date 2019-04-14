const jwt = require('jsonwebtoken')
const Net = require('../../tools/net')

module.exports = options => {
  return async function isAdmin(ctx, next) {
    // 可以从cookie里面获得token，也可以从request header里获取token
    const token = ctx.header.cookie ? Net.cookie.getFromCookie(ctx.header.cookie,this.config.token_name) : ctx.cookies.get(this.config.token_name)

    try {
      if(!token) ctx.throw('Please login')
      const decoded = jwt.verify(token, this.config.keys)
      const username = decoded.userName
      const id = decoded.userId
      if(!username || !id) ctx.throw('Verify token fail')

      let user = await ctx.model.User.findOne({ _id:id, username })
      if (!user) ctx.throw('Token invalid')
      if (user.role != '超级管理员') ctx.throw('权限不够')

      await next();
    } catch (e) {
      ctx.helper.error(ctx,e)
    }
  };
};
