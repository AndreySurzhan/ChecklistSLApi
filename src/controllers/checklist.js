const ChecklistRepo = require('../repositories/checklist');
const ItemRepo = require('../repositories/item');
const UserController = require('../controllers/user');

module.exports = class ChecklistController {
    constructor() {
        this.checklistRepo = new ChecklistRepo();
        this.itemRepo = new ItemRepo();
        this.userController = new UserController();
    }

    async addNewChecklist(checklist, user) {
        try {
            checklist.users = [];
            checklist.items = [];
            checklist.users.push(user._id);
            checklist.createdBy = user._id;
            checklist.modifiedBy = user._id;

            let newChecklist = await this.checklistRepo.insert(checklist);

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
        try {
            let checklist = await this.checklistRepo.findbyId(id);
        } catch (error) {
            return error;
        }

        return checklist;
    }

    async addItemToChecklist(id, item, user) {
        try {
            let checklist = await this.findChecklistById(id);

            item.checklist = id;
            item.createdBy = user._id;
            item.modifiedBy = user._id;
            item.translations = await this.translationController.translateMany(item.text, user);

            let addedItem = await this.itemController.addNewItem(item, user);

            checklist.modifiedBy = user._id;
            checklist.items.push(addedItem._id);

            let updatedChecklist = await this.checklistRepo.update(checklist);
        } catch (error) {
            return error;
        }

        return addedItem;
    }

    async updateItemInChecklist(id, itemId, item, user) {
        try {
            let checklist = await this.findChecklistById(id);
            let existingItem = await this.itemRepo.findbyId(itemId);

            item.modifiedBy = user._id;
            item.checklist = id;

            if (existingItem.text !== item.text) {
                item.translations = await this.translationController.translateMany(item.text, user)
            }

            let updatedItem = await this.itemRepo.update(id, itemId, item);

            checklist.modifiedBy = user._id;

            let updatedChecklist = await this.checklistRepo.update(checklist);
        } catch (error) {
            return error;
        }

        return updatedItem;
    }

    async deleteItemFromChecklist(id, itemId, user) {
        try {
            let checklist = await this.findChecklistById(id);
            let deletedItem = await this.itemRepo.delete(itemId, id);

            checklist.modifiedBy = user._id;

            for (let i = o; i < checklist.items.length; i++) {
                if (checklist.items[i]._id === deletedItem._id) {
                    checklist.items.splice(i, 1)
                }
            }

            let updatedChecklist = await this.checklistRepo.update(checklist);
        } catch (error) {
            return error;
        }

        return deletedItem;
    }

    async getAllChecklists(user) {
        try {
            let checklists = await this.checklistRepo.findAll(user._id);
        } catch (error) {
            return error;
        }

        return checklists;
    }

    async updateChecklist(checklist, user) {
        try {
            checklist.modifiedBy = user._id;

            let updatedChecklist = await this.checklistRepo.update(checklist);
        } catch (error) {
            return error;
        }

        return updatedChecklist;
    }

    async deleteChecklistById(id) {
        try {
            let deletedChecklist = await this.checklistRepo.delete(id);
            let deletedItems = await this.itemRepo.deleteManyById(deletedChecklist.items, checklistId);
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