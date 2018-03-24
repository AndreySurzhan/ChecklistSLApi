const logging = require('../utils/logging');
const ChecklistModel = require('../models/checklist');

module.exports = class ChecklistRepository {
    /**
     * Method that inserts new chechlist into database
     * 
     * @async
     * @param {Object} chechlist
     * @param {ObjectId[]} chechlist.items
     * @param {ObjectId[]} chechlist.users
     * @param {boolean} item.isActive
     * @param {Date} chechlist.created
     * @param {?Date} chechlist.modified
     * @param {ObjectId} chechlist.createdBy
     * @param {ObjectId} chechlist.modifiedBy
     * @returns {Promise <Query>}
     * @memberof ChecklistRepository
     */
    async insert(chechlist) {
        let createdChechlist = null

        try {
            chechlist = new ChecklistModel(chechlist)

            await chechlist.save();

            createdChechlist = await ChecklistModel.findOne(chechlist._id)
        } catch (error) {
            logging.error(`Failed to insert new checklist`);
            logging.error(error);

            return error;
        }

        if (!createdChechlist) {
            return new Error('Failed to get checklist after it\'s been saved')
        }

        logging.info(`New checklist "${createdChechlist._id}" has been successfully created`);
        return createdChechlist;
    }

    /**
     * Method that gets existing item by checklist id
     * 
     * @async
     * @param {string} userId 
     * @returns {Promise <Query>[]}
     * @memberof ChecklistRepository
     */
    async findAll(userId) {
        let existedChecklists = null

        try {
            existedChecklists = ChecklistModel.find({
                users: userId
            })
        } catch (error) {
            logging.error(`Failed to find all checklists by user id "${userId}" from database`);
            logging.error(error);

            return error;
        }

        if (!existedChecklists) {
            return new Error(`Checklists with user id "${userId}" don't exist`)
        }

        logging.info(`All checklists have been successfully found by user id "${userId}"`);
        return existedChecklists;
    }

    /**
     * Method that updates existing chechlist into database
     * 
     * @async
     * @param {Object} chechlist
     * @param {ObjectId} chechlist._id
     * @param {ObjectId[]} chechlist.items
     * @param {ObjectId[]} chechlist.users
     * @param {boolean} item.isActive
     * @param {Date} chechlist.created
     * @param {?Date} chechlist.modified
     * @param {ObjectId} chechlist.createdBy
     * @param {ObjectId} chechlist.modifiedBy
     * @returns {Promise <Query>}
     * @memberof ChecklistRepository
     */
    async update(checklist) {
        let updatedChecklist = null;

        try {
            updatedChecklist = await ChecklistModel.findOneAndUpdate({
                _id: checklist._id
            }, {
                $set: {
                    name: checklist.name,
                    items: checklist.items,
                    users: checklist.users,
                    isActive: checklist.isActive,
                    created: new Date(),
                    modifiedBy: checklist.modifiedBy,
                    modified: new Date()
                }
            }, {
                new: true
            })
        } catch (error) {
            logging.error(`Failed to update checklist with id "${checklist._id}"`)
            logging.error(error);

            return error;
        }

        if (!updatedChecklist) {
            return new Error(`Failed to get updated checklist with id "${checklist._id}"`)
        }

        logging.info(`Checklist "${updatedChecklist._id}" has been succesfully updated`);

        return updatedChecklist;
    }

    async delete(id) {
        let deletedChecklist = null;

        try {
            deletedChecklist = await ChecklistModel.deleteOne({
                _id: id
            }, {
                new: true
            })
        } catch (error) {
            logging.error(`Failed to delete checklist with id "${id}"`)
            logging.error(error);

            return error;
        }

        if (!deletedChecklist) {
            return new Error(`Failed to get deleted checklist with id "${id}"`)
        }

        logging.info(`Checklist "${deletedChecklist._id}" has been succesfully deleted`);

        return deletedChecklist;
    }
}