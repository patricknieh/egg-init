module.exports = app => {
  const {router, controller, middleware} = app;

  router
    //tool
    .get('/gt3', controller.common.gtRegister)
    .post('/getCode', controller.common.getCode)
    .post('/sendEmail', controller.common.sendEmail)
    .post('/uploadFile', controller.common.uploadFile)
    //user
    .post('/user', controller.user.register)
    .post('/user/login', controller.user.login)
    .post('/user/logout', controller.user.logout)
    .post('/user/resetPassword', middleware.isUser(), controller.user.resetPassword)
    .patch('/user/:id', middleware.isUser(), controller.user.patchUserInfo)
    .delete('/user/:username', middleware.isAdmin(), controller.user.deleteUser)
    .get('/user/:token', controller.user.getUserInfoByToken)
    .get('/user', controller.user.getUserInfoById)
    .get('/users', controller.user.listUser)
    //article
    .post('/article', controller.article.postArticle)
    .patch('/article/:id', controller.article.patchArticle)
    .delete('/article/:id', controller.article.delArticle)
    .get('/article/:id', controller.article.getArticle)
    .get('/articles', controller.article.listArticle)
    .get('/articles/search/:keyword', controller.article.listArticleBySearch)
    .get('/articles/tag/:tag', controller.article.listArticleByTag)
    .get('/articles/tagId/:tagId', controller.article.listArticleByTagId)
    //tag
    .get('/tags', controller.tag.listTag)
    //di
    .get('/di/getToken', controller.di.getDiToken)
};
