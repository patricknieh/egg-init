const nodemailer = require('nodemailer')

module.exports = {
  /**
   * @apiDefine success
   * @apiSuccess {Boolean} success  true
   */
  success(ctx) {
    return (
      ctx.body = {
        success: true
      }
    )
  },
  /**
   * @apiDefine data
   * @apiSuccess {Boolean} success  true
   * @apiSuccess {Number} total  总数
   * @apiSuccess {Object} data  对象
   */
  /**
   * @apiDefine dataArr
   * @apiSuccess {Boolean} success  true
   * @apiSuccess {Number} total  总数
   * @apiSuccess {Array} data  数组
   */
  data(ctx, data, total) {
    return (
      ctx.body = {
        success: true,
        data,
        total
      }
    )
  },
  /**
   * @apiDefine error
   * @apiError {Boolean} success  false
   * @apiError {String} message  错误信息
   */
  error(ctx, error) {
    console.error(error)
    return (
      ctx.body = {
        success: false,
        message: error.message
      }
    )
  },
  message(ctx, message) {
    console.error(error)
    return (
      ctx.body = {
        success: false,
        message
      }
    )
  },
  pagination(ctx) {
    let query = ctx.query
    let {pageIndex = 1, pageSize = 100, pageSort = 'createdAt'} = query
    let skip = (Number(pageIndex) - 1) * Number(pageSize)
    let limit = Number(pageSize)
    let sort = {}
    sort[pageSort] = -1
    delete query.pageIndex
    delete query.pageSize
    delete query.pageSort
    return {
      query,
      skip,
      limit,
      sort
    }
  },
  async sendMail(config, to, subject, html) {
    if (!to || !subject || !html) return '缺少字段'
    let transporter = nodemailer.createTransport({
      host: 'smtp.exmail.qq.com',
      service: 'smtp.exmail.qq.com',  //企业邮箱
      // service: 'qq',  //QQ邮箱
      port: 465,
      secure: true,
      auth: {
        user: config.SMTP.user,
        pass: config.SMTP.pass
      }
    })
    let mailOptions = {
      from: config.SMTP.user,
      to: to,
      subject: subject,
      html: html
    }
    let res = await transporter.sendMail(mailOptions)
    return res
  }
};
