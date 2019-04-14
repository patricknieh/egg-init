module.exports = app => {
  const {router, controller, middleware} = app;

  router
  //tool
    .get('/gt3', controller.common.gtRegister)
    .post('/getCode', controller.common.getCode)
    .post('/sendEmail', controller.common.sendEmail)
    .post('/uploadThumb', controller.common.uploadThumb)
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
    //di
    .get('/di/getToken', controller.di.getToken)
};
