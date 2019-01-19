# egg-init

egg init

## QuickStart

<!-- add docs here for user -->

see [egg docs][egg] for more detail.

### Development

```bash
$ npm i
$ npm run dev
$ open http://localhost:7001/
```

### Deploy

```bash
$ npm start
$ npm stop
```

### ApiDoc

```bash
$ apidoc -i app/ -o apidoc/
$ docker-compse up -d
```

### app.config.js

```bash
module.exports = {
  secret: 'egg-init',
  app: {
    domain: 'http://localhost:3000',
    host: '0.0.0.0',
    port: 3000
  },
  admin: {
    role: '超级管理员',
    username: 'paddy',
    password: 'paddy',
    name: 'paddy',
    email: 'patricknieh@qq.com'
  },
  mongoose: {
    user: 'paddy',
    pass: 'paddy123',
    database: 'nuxt-cms',
    port: '25015'
  },
  SMTPConfig: {
    user: 'patricknieh@qq.com',
    pass: ''
  }
}
```

### npm scripts

- Use `npm run lint` to check code style.
- Use `npm test` to run unit test.
- Use `npm run autod` to auto detect dependencies upgrade, see [autod](https://www.npmjs.com/package/autod) for more detail.


[egg]: https://eggjs.org
