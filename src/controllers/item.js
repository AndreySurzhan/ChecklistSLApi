const ItemRepo = require('../repositories/item');
const UserController = require('../controllers/user');
const TranslationController = require('../controllers/translation');

module.exports = class ItemController {

    constructor(userId) {
        const userController = new UserController();

        this.itemRepo = new ItemRepo();

        userController.getUserById(userId).then(user => {
            this.user = user;
        });
    }

    async addNewItem(item) {
        item.createdBy = this.user._id;
        item.modifiedBy = this.user._id;

        return await this.itemRepo.inser(item);
    }

    async getAllByChecklistId(checklistId) {
        return await this.itemRepo.findAll(checklistId);
    }

    async updateItem(item) {
        translationController = new TranslationController(this.user)

        item.translations = await translationController.translateMany(item.text)
        item.modifiedBy = this.user._id;

        return await this.itemRepo.update(item);
    }

    async deleteItem(id) {
        return await this.itemRepo.delete(id);
    }
};