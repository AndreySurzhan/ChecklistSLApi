const logging = require('../utils/logging');
const UserModel = require('../models/user');

module.exports = class UserRepository {
    /**
     * Method that inserts new user in database
     * 
     * @async
     * @param {Object} user
     * @param {string} user.password
     * @param {string} user.username
     * @param {Date} user.created
     * @param {Date} user.modified
     * @param {string[]} user.languages
     * @param {?ObjectId[]} user.checklists
     * @returns {Promise <Query>}
     * @memberof UserRepository
     */
    async insert(user) {
        let createdUser = null

        try {
            user = new UserModel(user)

            await user.save();

            createdUser = await UserModel.findById(user._id)
                .populate('checklists checklists.items checklists.items.translations');
        } catch (error) {
            logging.error(`Failed to create new user ${user.username}`);
            logging.error(console.error);
            ß

            return createdUser;
        }

        logging.info(`New user "${createdUser.username}" has been successfully created`);
        return createdUser;
    }

    /**
     * Method that gets exusting user by id
     * 
     * @async
     * @param {string} id 
     * @returns {Promise <Query>}
     * @memberof UserRepository
     */
    async findById(id) {
        let existedUser = null

        try {
            existedUser = UserModel.findById(id)
                .populate('checklists checklists.items checklists.items.translations');
        } catch (error) {
            logging.error(`Failed to get user with id "${id}" from database`);
            logging.error(console.error);

            return existedUser;
        }

        logging.info(`User has been successfully found by id "${id}"`);
        return existedUser;
    }

    async update(user) {
        let updatedUser = null;

        try {
            updatedUser = await UserModel.findOneAndUpdate({
                _id: user._id
            }, {
                $set: {
                    username: user.username,
                    password: user.password,
                    checklists: user.checklists,
                    languages: user.languages,
                    modified: new Date()
                }
            }, {
                new: true
            }).populate('checklists checklists.items checklists.items.translations');
        } catch (error) {
            logging.error(`Failed to update user with id "${user._id}" and username ${user.username}`)
            logging.error(console.error);

            return updatedUser;
        }

        logging.info(`User with username ${updatedUser.username} has been succesfully updated`);

        return updatedUser;
    }
}