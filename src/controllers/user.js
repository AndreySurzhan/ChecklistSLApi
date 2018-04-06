const UserRepo = require('../repositories/user');

module.exports = class UserController {

    constructor() {
        this.userRepo = new UserRepo();
    }

    async addNewUser(user) {
        let newUser;

        try {
            newUser = await this.userRepo.insert(user);
        } catch (error) {
            return error;
        }

        return newUser;
    }

    async getUserById(id) {
        let existingUser;

        try {
            existingUser = await this.userRepo.findById(id);

        } catch (error) {
            return error;
        }

        return existingUser;
    }

    async getUserByUsername(username) {
        let existingUser;

        try {
            existingUser = await this.userRepo.findByUsername(username);

        } catch (error) {
            return error;
        }

        return existingUser;
    }

    async getAllUsersByChecklistId(checlistId) {
        let existingUsers;

        try {
            existingUsers = await this.userRepo.findAllByChecklistId(checlistId);

        } catch (error) {
            return error;
        }

        return existingUsers;
    }

    async updateUser(user) {
        let updateUser;

        try {
            updateUser = await this.userRepo.update(user);

        } catch (error) {
            return error;
        }

        return updateUser;
    }
};