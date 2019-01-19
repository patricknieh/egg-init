const F = require('../../tools/file')
const nodemailer = require('nodemailer')
const appConfig = require('../../config/app.config')

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
  filePath(ctx, uri) {
    let file = ctx.request.files.file

    let fileName, filePath
    if (file.length > 0) {
      filePath = []
      for (let f of file) {
        fileName = F.getFileName(f.path)
        let fPath = `/uploads${uri}/${fileName}`
        filePath.push({name: f.name, url: fPath})
      }

      return (
        ctx.body = {
          success: true,
          data: filePath
        }
      )
    } else {
      fileName = F.getFileName(file.path)
      filePath = `/uploads${uri}/${fileName}`

      return (
        ctx.body = {
          success: true,
          data: {
            name: file.name,
            url: filePath
          }
        }
      )
    }
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
  uploadConfig(uri) {
    return {
      multipart: true,
      formidable: {
        uploadDir: path.join(__dirname, `../../static/uploads${uri}`),
        keepExtensions: true,    // 保持文件的后缀
        maxFieldsSize: 2 * 1024 * 1024  // 限制2M
      }
    }
  },
  async sendMail(to, subject, html) {
    if (!to || !subject || !html) return '缺少字段'
    let transporter = nodemailer.createTransport({
      host: 'smtp.exmail.qq.com',
      service: 'qq',  //QQ邮箱
      port: 465,
      secure: true,
      auth: {
        user: appConfig.SMTPConfig.user,
        pass: appConfig.SMTPConfig.pass
      }
    })
    let mailOptions = {
      from: appConfig.SMTPConfig.user,
      to: to,
      subject: subject,
      html: html
    }
    let res = await transporter.sendMail(mailOptions)
    return res
  }
};
