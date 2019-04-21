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
    console.error(message)
    return (
      ctx.body = {
        success: false,
        message
      }
    )
  },
}
