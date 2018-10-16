const logging = require('../utils/logging');
const ChecklistModel = require('../models/checklist');
const Repository = require('./repository');

module.exports = class ChecklistRepository extends Repository {
    constructor(){
        super(ChecklistModel, 'items');
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

            throw error;
        }

        if (!existedChecklists) {
            throw new Error(`Checklists with user id "${userId}" don't exist`)
        }

        logging.info(`All checklists have been successfully found by user id "${userId}"`);
        return existedChecklists;
    }
}