const path = require('path')
const os = require('os')

module.exports = appInfo => {

  console.log('env %o',appInfo.env)

  const config = exports = {};
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1523196159518_2034';
  config.tokenName = 'token';

  // add your config here
  config.middleware = [];

  //listen
  config.cluster = {
    listen: {
      path: '',
      port: 7001,
      hostname: '0.0.0.0',
    }
  };

  //view
  config.view = {
    defaultViewEngine: 'nunjuck s',
    mapping: {
      '.njk': 'nunjucks',
    },
  };

  // mongoose
  config.mongoose = {
    client: {
      url: `mongodb://paddy:paddy123@127.0.0.1:25015/admin-cms`,
      options: {
        useNewUrlParser: true
      },
    },
  };

  //security
  config.security = {
    csrf: {
      enable: false
    },
  };

  //cors
  config.cors = {
    origin: '*',
    // origin: 'http://localhost:8081',
    // origin: [],
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS',
    // credentials: true //前端credentials设置这里必须也要设为true
  };
  // config.origin = {
  //   whiteList: ['http://localhost:63342','http://localhost:3000','http://localhost:3001'] //设置多个可携带cookie访问的网站白名单
  // };

  //SMTP
  config.SMTPConfig = {
    user: '',
    pass: ''
  };

  //superagent
  config.superagent = {
    access_token_url: '',
    client_id: '',
    host: '',
  };

  //upload
  exports.multipart = {
    mode: 'file',
    fileSize: '50mb',
    tmpdir: path.join(os.tmpdir(), 'egg-multipart-tmp', appInfo.name)
  };

  return config;
};
