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

            createdItem = await ItemModel.findOne(item._id);
        } catch (error) {
            logging.error('Failed to insert new item');
            logging.error(error);

            throw error;
        }

        if (!createdItem) {
            throw new Error('Failed to get item after it\'s been saved')
        }

        logging.info(`New item "${createdItem._id}" has been successfully created`);
        return createdItem;
    }

    /**
     * Method that gets existing items by checklist id
     * 
     * @async
     * @param {string} checklistId 
     * @returns {Promise <Query>[]}
     * @memberof ItemRepository
     */
    async findAll(checklistId) {
        let existedItems = null

        try {
            existedItems = ItemModel.find({
                checklist: checklistId
            });
        } catch (error) {
            logging.error(`Failed to find all items by checklist id "${checklistId}" from database`);
            logging.error(error);

            throw error;
        }

        if (!existedItems) {
            throw new Error(`Items with checklist id "${checklistId}" don't exist`)
        }

        logging.info(`All Items have been successfully found by checklist id "${checklistId}"`);
        return existedItems;
    }

    /**
     * Method that gets existing item by item id
     * 
     * @async
     * @param {string} id 
     * @returns {Promise <Query>[]}
     * @memberof ItemRepository
     */
    async findById(id) {
        let existedItem = null

        try {
            existedItem = ItemModel.findById(id);
        } catch (error) {
            logging.error(`Failed to find item by id "${id}" from database`);
            logging.error(error);

            throw error;
        }

        if (!existedItem) {
            throw new Error(`Item with id "${id}" does\'t exist`)
        }

        logging.info(`Item has been successfully found by id "${id}"`);
        return existedItem;
    }

    /**
     * Method that updates existing item
     * 
     * @async
     * @param {Object} data
     * @param {string} data.text
     * @param {TranslationSchema[]} data.translations
     * @param {ObjectId} data.checklist
     * @param {boolean} data.isChecked
     * @param {?Date} data.modified
     * @param {ObjectId} data.modifiedBy
     * @returns {Promise <Query>}
     * @memberof ItemRepository
     */
    async update(id, data) {
        let updatedItem = null;

        try {
            updatedItem = await ItemModel.findOneAndUpdate({
                _id: id
            }, data, {
                new: true
            });
        } catch (error) {
            logging.error(`Failed to update item with id "${id}"`)
            logging.error(error);

            throw error;
        }

        if (!updatedItem) {
            throw new Error(`Failed to get updated item with id "${id}"`)
        }

        logging.info(`Item "${id}" has been succesfully updated`);

        return updatedItem;
    }

    async delete(id) {
        let deletedItem = null;

        try {
            deletedItem = await ItemModel.findOneAndRemove({
                _id: id
            });
        } catch (error) {
            logging.error(`Failed to delete item by id "${id}"`)
            logging.error(error);

            throw error;
        }

        if (!deletedItem) {
            throw new Error(`Failed to get deleted item`)
        }

        logging.info(`Item "${deletedItem._id}" has been succesfully deleted`);

        return deletedItem;
    }

    async deleteManyById(ids) {
        let deletedItems = null;

        try {
            deletedItems = await ItemModel.deleteMany({
                _id: {
                    $in: ids
                }
            });
        } catch (error) {
            logging.error(`Failed to delete many items by ids "${ids}"`)
            logging.error(error);

            throw error;
        }

        if (!deletedItems) {
            throw new Error(`Failed to get deleted items`)
        }

        logging.info(`Items "${ids}" have been succesfully deleted`);

        return deletedItems;
    }
}