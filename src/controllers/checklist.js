const ChecklistRepo = require('../repositories/checklist');
const ItemController = require('../controllers/item');
const UserController = require('../controllers/user');

module.exports = class ChecklistController {
    constructor() {
        this.checklistRepo = new ChecklistRepo();
        this.itemController = new ItemController();
        this.userController = new UserController();
    }

    async addNewChecklist(checklist, user) {
        let newChecklist;

        try {
            checklist.users = [];
            checklist.items = [];
            checklist.users.push(user._id);
            checklist.createdBy = user._id;
            checklist.modifiedBy = user._id;

            newChecklist = await this.checklistRepo.insert(checklist);

            if (!user.hasOwnProperty('checklists') || !(user.checklists instanceof Array)) {
                user.checklists = [];
            }

            user.checklists.push(newChecklist._id);

            await this.userController.updateUser(user);
        } catch (error) {
            return error;
        }

        return newChecklist
    }

    async findChecklistById(id) {
        return await this.checklistRepo.findbyId(id);
    }

    async addItemToChecklist(id, item, user) {
        let checklist = await this.findChecklistById(id);
        let addedItem = await this.itemController.addNewItem(item, user);

        checklist.modifiedBy = user._id;
        checklist.items.push(addedItem._id);

        return await this.checklistRepo.update(checklist);
    }

    async updatedItemInChecklist(id, item, user) {
        item.checklist = id;

        let updatedItem = await this.itemController.updateItem(item, user);

        return await this.findChecklistById(id);
    }

    async deleteItemFromChecklist(id, itemId, user) {
        let checklist = await this.findChecklistById(id);
        let deletedItem = await this.itemController.deleteItemById(checklistId, itemId);

        checklist.modifiedBy = user._id;
        checklist.items.push(addedItem._id);

        return await this.checklistRepo.update(checklist);
    }

    async getAllChecklists(user) {
        return await this.checklistRepo.findAll(user._id);
    }

    async updateChecklist(checklist, user) {
        checklist.modifiedBy = user._id;

        return await this.checklistRepo.update(checklist);
    }

    async deleteChecklistById(id) {
        try {
            let deletedChecklist = await this.checklistRepo.delete(id);
            let deletedItems = await this.itemController.deleteMany(deletedChecklist.items, deletedChecklist._id);
            let users = await this.userController.getAllUsersChecklists(id);

            for (let i = o; i < users.length; i++) {
                for (let k = 0; k < users[i].checklists.length; k++) {
                    let index = users[i].checklists[k].indexOf(id)

                    if (index > -1) {
                        users[i].checklists[k].splice(index, 1)

                        await this.userController.update(users[i]);
                    }
                }
            }
        } catch (error) {
            return error;
        }

        return deletedChecklist;
    }
};