const Utils = require('../extend/utils')
/**
 * @apiDefine SuccessUserModel
 * @apiSuccess {String} data.role  角色
 * @apiSuccess {String} data.avatar  头像
 * @apiSuccess {String} data.username  用户名
 * @apiSuccess {String} data.password  密码
 * @apiSuccess {String} data.name  姓名
 * @apiSuccess {String} data.email  邮箱
 */
/**
 * @apiDefine ParamUserModel
 * @apiParam {String} role  角色
 * @apiParam {String} avatar  头像
 * @apiParam {String} username  用户名
 * @apiParam {String} password  密码
 * @apiParam {String} name  姓名
 * @apiParam {String} email  邮箱
 */
module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const conn = app.mongooseDB.get('db0');
  const schema = new Schema({
    role: {
      type: String,
      default: '用户'
    },
    avatar: {
      type: String,
      default: ''
    },
    username: {
      type: String,
      default: '',
      index: true
    },
    password: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: ''
    },
    email: {
      type: String,
      default: ''
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

  //statics
  schema.statics = {
    findByRole:function(role, cb){
      return this.find({ role }, cb)
    }
  }

  //methods
  schema.methods = {
    sayHi:function(){
      console.log(`Hi, welcome ${this.name}`)
    }
  }

  //query
  schema.query = {
    byName:function(name){
      return this.where({ username: new RegExp(name, 'i') })
    }
  }

  return conn.model('User', schema);
}
