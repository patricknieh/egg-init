const Utils = require('../extend/utils')
/**
 * @apiDefine ParamArticleModel
 * @apiParam {String} name  名称
 * @apiParam {String} type  类型
 * @apiParam {String} subType  子类型
 * @apiParam {String} title  标题
 * @apiParam {String} subTitle  子标题
 * @apiParam {String} desc  描述
 * @apiParam {String} thumb  缩略图
 * @apiParam {String} summary  摘要
 * @apiParam {String} content  详细内容
 * @apiParam {Number} view  浏览次数
 * @apiParam {Number} status  状态
 * @apiParam {Boolean} visible  可见属性
 * @apiParam {Object} extend  扩展字段
 * @apiParam {ObjectId} user  用户
 */
module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const schema = new Schema({
    name: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: ''
    },
    subType: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    subTitle: {
      type: String,
      default: ''
    },
    desc: {
      type: String,
      default: ''
    },
    thumb: {
      type: String,
      default: ''
    },
    summary: {
      type: String,
      default: ''
    },
    content: {
      type: String,
      default: ''
    },
    view: {
      type: Number,
      default: 0
    },
    status: {
      type: Number,
      default: 0
    },
    visible: {
      type: Boolean,
      default: false
    },
    extend: {
      type: Object,
      default: {}
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    tags: [{
      type: Schema.Types.ObjectId,
      ref: 'Tag'
    }],
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },Utils.getModelOptions());

  return mongoose.model('Article', schema);
}
