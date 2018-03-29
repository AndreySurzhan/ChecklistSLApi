const ItemRepo = require('../repositories/item');
const UserController = require('../controllers/user');
const TranslationController = require('../controllers/translation');

module.exports = class ItemController {

    constructor() {
        this.itemRepo = new ItemRepo();
        this.traslationController = new TranslationController();
    }

    async addNewItem(item, user) {
        item.createdBy = user._id;
        item.modifiedBy = user._id;
        item.translations = await this.translationController.translateMany(item.text, user)

        return await this.itemRepo.inser(item);
    }

    async getAllByChecklistId(checklistId) {
        return await this.itemRepo.findAll(checklistId);
    }

    async updateItem(item, user) {
        item.translations = await this.translationController.translateMany(item.text, user)
        item.modifiedBy = user._id;

        return await this.itemRepo.update(item);
    }

    async deleteItemById(id) {
        return await this.itemRepo.delete(id);
    }

    async deleteAll(checklistId) {
        return await this.itemRepo.deleteAllByChecklistId(checklistId);
    }
};