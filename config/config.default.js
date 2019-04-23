const path = require('path')
const os = require('os')

module.exports = appInfo => {

  console.log('env %o',appInfo.env)

  const config = exports = {};
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1523196159518_2034';
  config.TOKEN_NAME = 'token';

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
    clients: {
      db0: {
        url: `mongodb://paddy:paddy123!%40%23@127.0.0.1:25015/ipr`,
        options: {useNewUrlParser: true,useFindAndModify: false},
      },
    }
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

  //origin
  // config.origin = {
  //   whiteList: ['http://localhost:63342','http://localhost:3000','http://localhost:3001'] //设置多个可携带cookie访问的网站白名单
  // };

  //socket
  config.io = {
    namespace: {
      '/': {
        connectionMiddleware: [ 'auth' ],
        packetMiddleware: [ ], // 针对消息的处理暂时不实现
      },
    },

    // cluster 模式下，通过 redis 实现数据共享
    redis: {
      host: '127.0.0.1',
      port: 6379,
      auth_pass: 'paddy123',
      db:0,
    },
  };

  //redis
  config.redis = {
    client: {
      port: 6379,
      host: '127.0.0.1',
      password: 'paddy123',
      db: 0,
    },
  };

  //SMTP
  config.SMTP = {
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
  config.multipart = {
    mode: 'file',
    fileSize: '50mb',
    tmpdir: path.join(os.tmpdir(), 'egg-multipart-tmp', appInfo.name)
  };

  //alinode
  // config.alinode = {
  //   appid: '',
  //   secret: '',
  // };

  return config;
};
