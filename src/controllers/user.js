const UserRepo = require('../repositories/user');

module.exports = class UserController {

    constructor() {
        this.userRepo = new UserRepo();
    }

    async addNewUser(req, res, next) {
        let user;

        try {
            user = await this.userRepo.insert(req.body);

            await res.json(user);
        } catch (error) {
            next(error);
        }
    }

    async getUserById(req, res, next) {
        let user;

        try {
            user = await this.userRepo.findById(req.params.userId);
            
            await res.json(user);
        } catch (error) {
            next(error);
        }
    }

    async updateUser(req, res, next) {
        let user;

        try {
            user = await this.userRepo.update(req.user._id, req.body);

            await res.json(user);
        } catch (error) {
            next(error);
        }
    }

    async loginUser(req, res, next) {
        let user;

        try {
            await res.json(req.user);
        } catch (error) {
            next(error);
        }
    }
};