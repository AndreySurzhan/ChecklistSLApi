const UserController = require('../controllers/user.js');

module.exports = (router, authenticate, authenticateWithPassword) => {
    this.userController = new UserController();

    router.post('/registration', this.userController.addNewUser)

    router.post('/login', authenticateWithPassword, this.userController.loginUser)

    router.patch('/user', authenticate, this.userController.updateUser)

    router.get('/user/:userId', authenticate, this.userController.getUserById)
};