const appConfig = require('../config/app.config')

module.exports = appInfo => {
  const config = exports = {};
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1523196159518_2034';

  // add your config here
  config.middleware = [];

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
      url: `mongodb://${appConfig.mongoose.user}:${appConfig.mongoose.pass}@127.0.0.1:${appConfig.mongoose.port}/${appConfig.mongoose.database}`,
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
    origin: 'http://localhost:8081',
    // origin: [],
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS',
    credentials: true //前端credentials设置这里必须也要设为true
  };
  // config.origin = {
  //   whiteList: ['http://localhost:63342','http://localhost:3000','http://localhost:3001'] //设置多个可携带cookie访问的网站白名单
  // };

  return config;
};
