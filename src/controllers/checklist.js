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
        let userData = {};

        try {
            checklist.users = [];
            checklist.items = [];
            checklist.isActive = true;
            checklist.users.push(user._id);
            checklist.createdBy = user._id;
            checklist.modifiedBy = user._id;

            newChecklist = await this.checklistRepo.insert(checklist);

            userData.checklists = user.checklists;
            userData.checklists.push(newChecklist._id);

            await this.userController.updateUser(user._id, userData);
        } catch (error) {
            throw error;
        }

        return newChecklist;
    }

    async findChecklistById(id) {
        let checklist;

        try {
            checklist = await this.checklistRepo.findById(id);
        } catch (error) {
            throw error;
        }

        return checklist;
    }

    async findChecklistsByUserId(id) {
        let checklist;

        try {
            checklist = await this.checklistRepo.findAll(id);
        } catch (error) {
            throw error;
        }

        return checklist;
    }

    async addItemToChecklist(id, item, user) {
        let addedItem;
        let checklist;

        try {
            checklist = await this.findChecklistById(id);
            user = await this.userController.getUserByUsername(user.username);

            item.checklist = id;
            item.createdBy = user._id;
            item.modifiedBy = user._id;
            item.translations = await this.translationController.translateMany(item.text, user);

            addedItem = await this.itemRepo.insert(item);

            checklist.items.push(addedItem._id);

            await this.updateChecklist(id, checklist, user);
        } catch (error) {
            throw error;
        }

        return addedItem;
    }

    async updateItemInChecklist(id, itemId, item, user) {
        let checklist;
        let existingItem;
        let updatedItem;

        try {
            checklist = await this.findChecklistById(id);
            existingItem = await this.itemRepo.findById(itemId);

            if (item.text && item.text !== existingItem.text) {
                item.text = item.text;
                item.translations = await this.translationController.translateMany(item.text, user);
            }

            updatedItem = await this.itemRepo.update(itemId, item);

            await this.updateChecklist(id, checklist, user);
        } catch (error) {
            throw error;
        }

        return updatedItem;
    }

    async deleteItemFromChecklist(id, itemId, user) {
        let checklist;
        let deletedItem;

        try {
            deletedItem = await this.itemRepo.delete(itemId);
            checklist = await this.findChecklistById(id);

            checklist.modifiedBy = user._id;

            for (let i = 0; i < checklist.items.length; i++) {
                if (checklist.items[i].toString() === deletedItem._id.toString()) {
                    checklist.items.splice(i, 1)
                }
            }

            await this.checklistRepo.update(checklist);
        } catch (error) {
            throw error;
        }

        return deletedItem;
    }

    async updateChecklist(id, checklist, user) {
        let updatedChecklist;

        try {
            checklist.modifiedBy = user._id;

            updatedChecklist = await this.checklistRepo.update(id, checklist);
        } catch (error) {
            throw error;
        }

        return updatedChecklist;
    }

    async deleteChecklistById(id) {
        let deletedChecklist;
        let users;

        try {
            deletedChecklist = await this.checklistRepo.delete(id);

            await this.itemRepo.deleteManyById(deletedChecklist.items);

            users = await this.userController.getAllUsersByChecklistId(id);

            for (let i = 0; i < users.length; i++) {
                for (let k = 0; k < users[i].checklists.length; k++) {
                    let index = users[i].checklists.indexOf(id)

                    if (index > -1) {
                        users[i].checklists.splice(index, 1)

                        await this.userController.updateUser(users[i]);
                    }
                }
            }
        } catch (error) {
            throw error;
        }

        return deletedChecklist;
    }
};