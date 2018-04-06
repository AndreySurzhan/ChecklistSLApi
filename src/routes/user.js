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
        }).catch((error) => {
            next(error);
        });
    });

    router.post('/user', authenticate, (req, res, next) => {
        this.userController.getUserById(req.user._id)
            .then((user) => {
                res.json(user);
            }).catch((error) => {
                next(error);
            });
    });

    router.patch('/user', authenticate, (req, res, next) => {
        req.user.languages = req.body.languages;

        this.userController.updateUser(req.user)
            .then((user) => {
                res.json(user);
            }).catch((error) => {
                next(error);
            });
    });
};