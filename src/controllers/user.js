const UserRepo = require('../repositories/user');

module.exports = class UserController {

    constructor() {
        this.userRepo = new UserRepo();
    }

    async addNewUser(user) {
        return await this.userRepo.inser(user);
    }

    async getUserById(id) {
        return await this.userRepo.findById(id);
    }

    async updateUser(user) {
        return await this.userRepo.update(user);
    }
};