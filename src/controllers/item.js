const ItemRepo = require('../repositories/item');

module.exports = class ItemController {

    constructor() {
        this.itemRepo = new ItemRepo();
    }

    async addNewItem(checklist) {
        return await this.itemRepo.inser(checklist);
    }

    async getAllByChecklistId(checklistId) {
        return await this.itemRepo.findAll(checklistId);
    }

    async updateItem(item) {
        //TODO: add get translation logic
        // update items with new translation

        return await this.itemRepo.update(item);
    }

    async deleteItem(id) {
        return await this.itemRepo.delete(id);
    }
};