const logging = require('../utils/logging');
const ChecklistModel = require('../models/checklist');

module.exports = class ChecklistRepository {
    /**
     * Method that inserts new chechlist into database
     * 
     * @async
     * @param {Object} checklist
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
    async insert(checklist) {
        let createdChecklist = null

        try {
            checklist.created = new Date();

            checklist = new ChecklistModel(checklist)

            await checklist.save();

            createdChecklist = await ChecklistModel.findOne(checklist._id).populate('items');
        } catch (error) {
            logging.error(`Failed to insert new checklist`);
            logging.error(error);

            return error;
        }

        if (!createdChecklist) {
            return new Error('Failed to get checklist after it\'s been saved')
        }

        logging.info(`New checklist "${createdChecklist._id}" has been successfully created`);
        return createdChecklist;
    }

    /**
     * Method that gets existing checklist by checklist id
     * 
     * @async
     * @param {ObjectId} checklistId 
     * @returns {Promise <Query>}
     * @memberof ChecklistRepository
     */
    async findbyId(checklistId) {
        let existedChecklist = null

        try {
            existedChecklist = await ChecklistModel.findById(checklistId).populate('items');
        } catch (error) {
            logging.error(`Failed to find checklist by id "${checklistId}" from database`);
            logging.error(error);

            return error;
        }

        if (!existedChecklist) {
            return new Error(`Checklist with id "${checklistId}" doesn't exist`)
        }

        logging.info(`Checklist has been successfully found by id "${checklistId}"`);
        return existedChecklist;
    }

    /**
     * Method that gets existing checklists by user id
     * 
     * @async
     * @param {ObjectId} userId 
     * @returns {Promise <Query>[]}
     * @memberof ChecklistRepository
     */
    async findAll(userId) {
        let existedChecklists = null

        try {
            existedChecklists = await ChecklistModel.find({
                users: userId
            }).populate('items');
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
     * @param {Object} checklist
     * @param {ObjectId} checklist._id
     * @param {ObjectId[]} checklist.items
     * @param {ObjectId[]} checklist.users
     * @param {boolean} item.isActive
     * @param {?Date} checklist.modified
     * @param {ObjectId} checklist.modifiedBy
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
                    modifiedBy: checklist.modifiedBy,
                    modified: new Date()
                }
            }, {
                new: true
            }).populate('items');
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


    /**
     * Method that deletes existing chechlist from db
     * 
     * @async
     * @param {ObjectId} id
     * @returns {Promise <Query>}
     * @memberof ChecklistRepository
     */
    async delete(id) {
        let deletedChecklist = null;

        try {
            deletedChecklist = await ChecklistModel.findOneAndRemove({
                _id: id
            });
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