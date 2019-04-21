const Utils = require('../extend/utils')
/**
 * @apiDefine ParamUserModel
 * @apiParam {String} name  名称
 */
module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const conn = app.mongooseDB.get('db0');
  const schema = new Schema({
    name: {
      type: String,
      default: '',
      index: true,
      unique: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },Utils.getModelOptions());

  return conn.model('Tag', schema);
}
