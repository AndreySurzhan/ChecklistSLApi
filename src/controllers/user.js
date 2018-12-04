const UserRepo = require('../repositories/user');

module.exports = class UserController {

    constructor() {
        this.userRepo = new UserRepo();
    }

    async addNewUser(req, res, next) {
        let user;

        try {
            user = await this.userRepo.insert(req.body);

            res.json(user);
        } catch (error) {
            next(error);
        }
    }

    async getUserById(req, res, next) {
        let user;

        try {
            user = await this.userRepo.findById(req.params.userId);
            
            res.json(user);
        } catch (error) {
            next(error);
        }
    }

    async updateUser(req, res, next) {
        let user;

        try {
            user = await this.userRepo.update(req.user._id, req.body);

            res.json(user);
        } catch (error) {
            next(error);
        }
    }

    async loginUser(req, res, next) {
        let user;

        try {
            res.json(req.user.token);
        } catch (error) {
            next(error);
        }
    }
};