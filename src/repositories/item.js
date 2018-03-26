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
     * @param {?Date} item.created
     * @param {?Date} item.modified
     * @param {ObjectId} item.createdBy
     * @param {ObjectId} item.modifiedBy
     * @returns {Promise <Query>}
     * @memberof ItemRepository
     */
    async insert(item) {
        let createdItem = null

        item.created = new Date();

        try {
            item = new ItemModel(item)

            await item.save();

            createdItem = await ItemModel.findOne(item._id)
        } catch (error) {
            logging.error('Failed to insert new item');
            logging.error(error);

            return error;
        }

        if (!createdItem) {
            return new Error('Failed to get item after it\'s been saved')
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

        if (!existedItems) {
            return new Error(`Items with checklist id "${checklistId}" don't exist`)
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
                    translations: item.translations,
                    modifiedBy: item.modifiedBy,
                    modified: new Date()
                },
            }, {
                new: true
            })
        } catch (error) {
            logging.error(`Failed to update item with id "${item._id}"`)
            logging.error(error);

            return error;
        }

        if (!updatedItem) {
            return new Error(`Failed to get updated item with id "${item._id}"`)
        }

        logging.info(`Item "${item._id}" has been succesfully updated`);

        return updatedItem;
    }

    async delete(id) {
        let deletedItem = null;

        try {
            deletedItem = await ItemModel.deleteOne({
                _id: id
            }, {
                new: true
            })
        } catch (error) {
            logging.error(`Failed to delete item by id "${id}"`)
            logging.error(error);

            return error;
        }

        if (!deletedItem) {
            return new Error(`Failed to get deleted item`)
        }

        logging.info(`Item "${deletedItem._id}" has been succesfully deleted`);

        return deletedItem;
    }

    async deleteAllByChecklistId(checklistId) {
        let deletedItem = null;

        try {
            deletedItem = await ItemModel.deleteMany({
                checklist: checklistId
            }, {
                new: true
            })
        } catch (error) {
            logging.error(`Failed to delete item by checklist id "${item._id}"`)
            logging.error(error);

            return error;
        }

        if (!deletedItem) {
            return new Error(`Failed to get deleted item`)
        }

        logging.info(`Item "${deletedItem._id}" has been succesfully deleted`);

        return deletedItem;
    }
}