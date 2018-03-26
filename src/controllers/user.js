const UserRepo = require('../repositories/user');

module.exports = class UserController {

    constructor() {
        this.userRepo = new UserRepo();
    }

    async addNewUser(user) {
        return await this.userRepo.insert(user);
    }

    async getUserById(id) {
        return await this.userRepo.findById(id);
    }

    async getUserByUsername(username) {
        return await this.userRepo.findByUsername(username);
    }

    async getAllUsersByChecklistId(checlistId) {
        return await this.userRepo.findAllByChecklistId(checlistId);
    }

    async updateUser(user) {
        return await this.userRepo.update(user);
    }
};