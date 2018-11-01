const UserController = require('../controllers/user.js');


module.exports = (router, authenticate, authenticateWithPassword) => {
    this.userController = new UserController();

    router.post('/registration', (req, res, next) => {
        this.userController.addNewUser(req.body).then((user) => {
            res.json(user);
        }).catch((error) => {
            next(error);
        });
    });

    router.post('/login', authenticateWithPassword, (req, res, next) => {
        res.json(req.user.token);
    });

    router.patch('/user', authenticate, (req, res, next) => {
        this.userController.updateUser(req.user._id, req.body)
            .then((user) => {
                res.json(user);
            }).catch((error) => {
                next(error);
            });
    });

    router.get('/user/:userId', authenticate, (req, res, next) => {
        this.userController.getUserById(req.params.userId)
            .then((user) => {
                res.json(user);
            }).catch((error) => {
                next(error);
            });
    });
};