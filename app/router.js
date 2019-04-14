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
    .get('/user/:token', controller.user.getUserInfo)
    .get('/user', controller.user.getUserInfoById)
    .get('/users', controller.user.list)
    //article
    .post('/article', controller.article.post)
    .patch('/article/:id', controller.article.patch)
    .delete('/article/:id', controller.article.del)
    .get('/article/:id', controller.article.get)
    .get('/articles', controller.article.list)
    .get('/articles/search/:keyword', controller.article.listBySearch)
    .get('/articles/tag/:tag', controller.article.listByTag)
    .get('/articles/tagId/:tagId', controller.article.listByTagId)
    //tag
    .get('/tags', controller.tag.list)
    //di
    .get('/di/getToken', controller.di.getToken)
};
