const ChecklistRepo = require('../repositories/checklist');
const ItemRepo = require('../repositories/item');

module.exports = class ChecklistController {

    constructor() {
        this.checklistRepo = new ChecklistRepo();
    }

    async addNewChecklist(checklist) {
        return await this.checklistRepo.inser(checklist);
    }

    async getAllByUserId(userId) {
        return await this.checklistRepo.findAll(userId);
    }

    async updateChecklist(checklist) {
        return await this.checklistRepo.update(checklist);
    }

    async deleteChecklist(id) {
        let itemRepo = new ItemRepo();

        await itemRepo.deleteAll(id);

        return await this.checklistRepo.delete(id);
    }
};