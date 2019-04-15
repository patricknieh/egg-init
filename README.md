# egg-init

egg init

## QuickStart

<!-- add docs here for user -->

see [egg docs][egg] for more detail.

### Development

```bash
$ yarn dev
```

### Deploy

```bash
$ EGG_SERVER_ENV=<env> yarn start
$ yarn stop
```

### ApiDoc

```bash
$ npm install apidoc -g
$ apidoc -i app/ -o apidoc/
$ docker-compose up -d
```

### npm scripts

- Use `npm run lint` to check code style.
- Use `npm test` to run unit test.
- Use `npm run autod` to auto detect dependencies upgrade, see [autod](https://www.npmjs.com/package/autod) for more detail.


[egg]: https://eggjs.org
