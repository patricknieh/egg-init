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
    .get('/user/:token', controller.user.getUserInfo)
    .get('/user', controller.user.getUserInfoById)
    .patch('/user/:id', controller.user.patchUserInfo)
    .delete('/user/:username', controller.user.deleteUser)
    // .delete('/user/:username', middleware.isUser(), controller.user.deleteUser)
    .post('/user/login', controller.user.login)
    .post('/user/logout', controller.user.logout)
    .post('/user/resetPassword', controller.user.resetPassword)
    .get('/users', controller.user.list)
    //di
    .get('/di/getToken', controller.di.getToken)
};
