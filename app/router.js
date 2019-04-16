module.exports = app => {
  const {router, controller, middleware} = app
  const authUser = middleware.auth({target:'user'},app)
  const authAdmin = middleware.auth({target:'admin'},app)

  const {
    common,
    user,
    article,
    tag,
  } = controller

  router
    //tool
    .get('/gt3', common.gtRegister)
    .post('/getCode', common.getCode)
    .post('/sendEmail', common.sendEmail)
    .post('/uploadFile', common.uploadFile)
    //user
    .post('/user', user.register)
    .post('/user/login', user.login)
    .post('/user/logout', authUser, user.logout)
    .post('/user/resetPassword', authUser, user.resetPassword)
    .patch('/user/:id', authUser, user.patchUserInfo)
    .delete('/user/:username', authAdmin, user.deleteUser)
    .get('/user/:token', user.getUserInfoByToken)
    .get('/user', user.getUserInfoById)
    .get('/users', user.listUser)
    //article
    .post('/article', authUser, article.postArticle)
    .patch('/article/:id', authUser, article.patchArticle)
    .delete('/article/:id', authUser, article.delArticle)
    .get('/article/:id', article.getArticle)
    .get('/articles', article.listArticle)
    .get('/articles/search/:keyword', article.listArticleBySearch)
    .get('/articles/tag/:tag', article.listArticleByTag)
    .get('/articles/tagId/:tagId', article.listArticleByTagId)
    //tag
    .get('/tags', tag.listTag)
};
