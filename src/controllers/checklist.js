const ChecklistRepo = require('../repositories/checklist');
const ItemRepo = require('../repositories/item');
const UserController = require('../controllers/user');
const TranslationController = require('../controllers/translation');


module.exports = class ChecklistController {
    constructor() {
        this.checklistRepo = new ChecklistRepo();
        this.itemRepo = new ItemRepo();
        this.userController = new UserController();
        this.translationController = new TranslationController();
    }

    async addNewChecklist(checklist, user) {
        let newChecklist;

        try {
            checklist.users = [];
            checklist.items = [];
            checklist.isActive = true;
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
        let checklist;

        try {
            checklist = await this.checklistRepo.findbyId(id);
        } catch (error) {
            return error;
        }

        return checklist;
    }

    async getAllByUserId(userId) {
        let checklist;

        try {
            checklist = await this.checklistRepo.findAll(userId);
        } catch (error) {
            return error;
        }

        return checklist;
    }

    async addItemToChecklist(id, item, user) {
        let addedItem;
        let checklist;
        let updatedChecklist;

        try {
            checklist = await this.findChecklistById(id);
            user = await this.userController.getUserByUsername(user.username);

            item.checklist = id;
            item.createdBy = user._id;
            item.modifiedBy = user._id;
            item.translations = await this.translationController.translateMany(item.text, user);

            addedItem = await this.itemRepo.insert(item);

            checklist.modifiedBy = user._id;
            checklist.items.push(addedItem._id);

            updatedChecklist = await this.checklistRepo.update(checklist);
        } catch (error) {
            return error;
        }

        return addedItem;
    }

    async updateItemInChecklist(id, itemId, item, user) {
        let checklist;
        let updatedItem;
        let updatedChecklist;

        try {
            checklist = await this.findChecklistById(id);

            item.modifiedBy = user._id;
            item.checklist = id;

            item.translations = await this.translationController.translateMany(item.text, user)

            updatedItem = await this.itemRepo.update(id, itemId, item);

            checklist.modifiedBy = user._id;

            updatedChecklist = await this.checklistRepo.update(checklist);
        } catch (error) {
            return error;
        }

        return updatedItem;
    }

    async deleteItemFromChecklist(id, itemId, user) {
        let checklist;
        let deletedItem;
        let updatedChecklist;

        try {
            deletedItem = await this.itemRepo.delete(itemId, id);
            checklist = await this.findChecklistById(id);

            checklist.modifiedBy = user._id;

            for (let i = 0; i < checklist.items.length; i++) {
                if (checklist.items[i].toString() === deletedItem._id.toString()) {
                    checklist.items.splice(i, 1)
                }
            }

            updatedChecklist = await this.checklistRepo.update(checklist);
        } catch (error) {
            return error;
        }

        return deletedItem;
    }

    async updateChecklist(checklist, user) {
        let updatedChecklist;

        try {
            checklist.modifiedBy = user._id;

            updatedChecklist = await this.checklistRepo.update(checklist);
        } catch (error) {
            return error;
        }

        return updatedChecklist;
    }

    async deleteChecklistById(id) {
        let deletedChecklist;
        let deletedItems;
        let users;

        try {
            deletedChecklist = await this.checklistRepo.delete(id);
            deletedItems = await this.itemRepo.deleteManyById(deletedChecklist.items);
            users = await this.userController.getAllUsersByChecklistId(id);

            for (let i = 0; i < users.length; i++) {
                for (let k = 0; k < users[i].checklists.length; k++) {
                    let index = users[i].checklists[k].indexOf(id)

                    if (index > -1) {
                        users[i].checklists[k].splice(index, 1)

                        await this.userController.updateUser(user[i]);
                    }
                }
            }
        } catch (error) {
            return error;
        }

        return deletedChecklist;
    }
};