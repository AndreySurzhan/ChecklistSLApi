const logging = require('../utils/logging');
const ItemModel = require('../models/item');

module.exports = class ItemRepository {
    /**
     * Method that inserts new item into database
     * 
     * @async
     * @param {Object} item
     * @param {string} item.text
     * @param {TranslationSchema[]} item.translations
     * @param {ObjectId} item.checklist
     * @param {boolean} item.isChecked
     * @param {Date} item.created
     * @param {?Date} item.modified
     * @param {ObjectId} item.createdBy
     * @param {ObjectId} item.modifiedBy
     * @returns {Promise <Query>}
     * @memberof ItemRepository
     */
    async insert(item) {
        let createdItem = null

        try {
            item = new ItemModel(item)

            await item.save();

            createdItem = await ItemModel.findOne(item._id)
        } catch (error) {
            logging.error(`Failed to insert new item`);
            logging.error(error);

            return error;
        }

        logging.info(`New item "${createdItem._id}" has been successfully created`);
        return createdItem;
    }

    /**
     * Method that gets existing item by checklist id
     * 
     * @async
     * @param {string} itemId 
     * @returns {Promise <Query>[]}
     * @memberof ItemRepository
     */
    async findAll(checklistId) {
        let existedItems = null

        try {
            existedItems = ItemModel.find({
                checklist: checklistId
            })
        } catch (error) {
            logging.error(`Failed to find all items by checklist id "${checklistId}" from database`);
            logging.error(error);

            return error;
        }

        logging.info(`All Items have been successfully found by checklist id "${checklistId}"`);
        return existedItems;
    }

    /**
     * Method that updates existing item
     * 
     * @async
     * @param {Object} item
     * @param {string} item.text
     * @param {ObjectId} item._id
     * @param {TranslationSchema[]} item.translations
     * @param {ObjectId} item.checklist
     * @param {boolean} item.isChecked
     * @param {Date} item.created
     * @param {?Date} item.modified
     * @param {ObjectId} item.createdBy
     * @param {ObjectId} item.modifiedBy
     * @returns {Promise <Query>}
     * @memberof ItemRepository
     */
    async update(item) {
        let updatedItem = null;

        try {
            updatedItem = await ItemModel.findOneAndUpdate({
                _id: item._id
            }, {
                $set: {
                    text: item.text,
                    language: item.language,
                    checklist: item.checklist,
                    isChecked: item.isChecked,
                    translation: item.translation,
                    modifiedBy: item.modifiedBy,
                    modified: new Date()
                }
            }, {
                new: true
            })
        } catch (error) {
            logging.error(`Failed to update item with id "${item._id}"`)
            logging.error(error);

            return error;
        }

        logging.info(`Item "${item._id}" has been succesfully updated`);

        return updatedItem;
    }
}