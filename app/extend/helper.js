const nodemailer = require('nodemailer')

module.exports = {
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
