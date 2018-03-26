const config = require('config');
const UserController = require('../controllers/user.js');


module.exports = (router, authenticate) => {
    this.userController = new UserController();

    router.post('/registration', (req, res, next) => {
        this.userController.addNewUser({
            username: req.body.username,
            password: req.body.password
        }).then((user) => {
            res.json(user);
        }).catch(() => {
            next(error);
        });
    });

    router.get('/user', authenticate, (req, res, next) => {
        this.userController.getUserById({
            id: req.user._id
        }).then((user) => {
            res.json(user);
        }).catch(() => {
            next(error);
        });
    });
};