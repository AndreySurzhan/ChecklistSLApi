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
     * @param {string[]} user.languages
     * @param {?ObjectId[]} user.checklists
     * @returns {Promise <Query>}
     * @memberof UserRepository
     */
    async insert(user) {
        let createdUser = null

        user.created = new Date();

        try {
            user = new UserModel(user);

            await user.save();

            createdUser = await UserModel.findById(user._id).populate('checklists');
        } catch (error) {
            logging.error(`Failed to create new user ${user.username}`);
            logging.error(error);

            return error;
        }

        if (!createdUser) {
            return new Error('Failed to get user after it has been saved')
        }

        logging.info(`New user "${createdUser.username}" has been successfully created`);
        return createdUser;
    }

    /**
     * Method that gets existing user by id
     * 
     * @async
     * @param {string | ObjectId} id 
     * @returns {Promise <Query>}
     * @memberof UserRepository
     */
    async findById(id) {
        let existedUser = null

        try {
            existedUser = await UserModel.findById(id).populate({
                path: 'checklists',
                populate: {
                    path: 'items'
                }
            });
        } catch (error) {
            logging.error(`Failed to find user with id "${id}" from database`);
            logging.error(error);

            throw error;
        }

        if (!existedUser) {
            throw new Error(`User with id "${id}" doesn't exist`)
        }

        logging.info(`User has been successfully found by id "${id}"`);
        return existedUser;
    }

    /**
     * Method that gets existing user by username
     * 
     * @async
     * @param {string} username 
     * @returns {Promise <Query>}
     * @memberof UserRepository
     */
    async findByUsername(username) {
        let existedUser = null

        try {
            existedUser = UserModel.findOne({
                    username: username
                })
                .populate({
                    path: 'checklists',
                    populate: {
                        path: 'items'
                    }
                });
        } catch (error) {
            logging.error(`Failed to find user with username "${username}" from database`);
            logging.error(error);

            throw error;
        }

        if (!existedUser) {
            throw new Error(`User with username "${username}" doesn't exist`)
        }

        logging.info(`User has been successfully found by username "${username}"`);
        return existedUser;
    }

    /**
     * Method that gets existing users by checklistId
     * 
     * @async
     * @param {string | ObjectId} checklistId 
     * @returns {Promise <Query>}
     * @memberof UserRepository
     */
    async findAllByChecklistId(checklistId) {
        let existedUsers = [];

        try {
            existedUsers = await UserModel.find({
                    checklists: checklistId
                })
                .populate({
                    path: 'checklists',
                    populate: {
                        path: 'items'
                    }
                });
        } catch (error) {
            logging.error(`Failed to find users by checklistid "${checklistId}" from database`);
            logging.error(error);

            throw error;
        }

        if (!existedUsers) {
            throw new Error(`Users with checklist "${checklistId}" don't exist`)
        }

        logging.info(`Users has been successfully found by cehcklist id "${checklistId}"`);
        return existedUsers;
    }

    /**
     * Method that updates user data in database
     * 
     * @async
     * @param {Object} user
     * @param {string} user.password
     * @param {string} user.username
     * @param {?Date} user.modified
     * @param {string[]} user.languages
     * @param {?ObjectId[]} user.checklists
     * @returns {Promise <Query>}
     * @memberof UserRepository
     */
    async update(user) {
        let updatedUser;

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
            }).populate({
                path: 'checklists',
                populate: {
                    path: 'items'
                }
            });
        } catch (error) {
            logging.error(`Failed to update user with id "${user._id}" and username ${user.username}`)
            logging.error(error);

            throw error;
        }

        if (!updatedUser) {
            return new Error(`Failed to get updated user with id "${user._id}"`)
        }

        logging.info(`User with username ${updatedUser.username} has been succesfully updated`);

        return updatedUser;
    }
}