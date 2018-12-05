const UserController = require('../controllers/user.js');

module.exports = (router, authenticate, authenticateWithPassword) => {
    let userController = new UserController();

    router.post('/registration', userController.addNewUser.bind(userController));

    router.post('/login', authenticateWithPassword, userController.loginUser.bind(userController));

    router.patch('/user', authenticate, userController.updateUser.bind(userController));

    router.get('/user/:userId', authenticate, userController.getUserById.bind(userController));
};