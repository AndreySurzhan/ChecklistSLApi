const ChecklistRepo = require('../repositories/checklist');
const ItemRepo = require('../repositories/item');
const UserRepo = require('../repositories/user');
const TranslationController = require('../controllers/google-translation');


module.exports = class ChecklistController {
    constructor() {
        this.checklistRepo = new ChecklistRepo();
        this.itemRepo = new ItemRepo();
        this.userRepo = new UserRepo();
        this.translationController = new TranslationController();
    }

    async addNewChecklist(req, res, next) {
        const checklist = req.body;
        const user = req.user;

        try {
            checklist.users = [];
            checklist.items = [];
            checklist.isActive = true;
            checklist.users.push(user._id);
            checklist.createdBy = user._id;
            checklist.modifiedBy = user._id;

            const newChecklist = await this.checklistRepo.insert(checklist);

            user.checklists.push(newChecklist._id);

            await this.userRepo.update(user._id, user);

            await res.json(newChecklist);
        } catch (error) {
            next(error);
        }
    }

    async findChecklistById(req, res, next) {
        let checklist;

        try {
            checklist = await this.checklistRepo.findById(req.params.id);
            
            await res.json(checklist);
        } catch (error) {
            next(error);
        }
    }

    async findChecklistsByUserId(req, res, next) {
        let checklists;

        try {
            checklists = await this.checklistRepo.findAll(req.user._id);
            
            await res.json(checklists);
        } catch (error) {
            next(error);
        }
    }

    async addItemToChecklist(req, res, next) {
        const id = req.params.id;
        const item = req.body; 
        const user = req.user;

        try {
            const checklist = await this.checklistRepo.findById(req.params.id);

            item.checklist = id;
            item.createdBy = user._id;
            item.modifiedBy = user._id;
            item.translations = await this.translationController.translateMany(item.text, user);

            const addedItem = await this.itemRepo.insert(item);

            checklist.items.push(addedItem._id);

            await await this.checklistRepo.update(id, checklist, user._id);
            
            await res.json(addedItem);
        } catch (error) {
            next(error);
        }
    }

    async updateItemInChecklist(req, res, next) {
        let checklist;
        let existingItem;
        let id = req.params.id;
        let item = req.body;
        let itemId = req.params.itemId;
        let user = req.user;
        let updatedItem;

        try {
            checklist = await this.checklistRepo.findById(req.params.id);
            existingItem = await this.itemRepo.findById(itemId);

            if (item.text && item.text !== existingItem.text) {
                item.text = item.text;
                item.translations = await this.translationController.translateMany(item.text, user);
            }

            updatedItem = await this.itemRepo.update(itemId, item);

            await await this.checklistRepo.update(id, checklist, user._id);
            
            await res.json(updatedItem);
        } catch (error) {
            next(error);
        }
    }

    async deleteItemFromChecklist(req, res, next) {
        let checklist;
        let deletedItem;
        let id = req.params.id;
        let itemId = req.params.itemId;
        let user = req.user;

        try {
            deletedItem = await this.itemRepo.delete(itemId);
            checklist = await this.checklistRepo.findById(id);

            checklist.modifiedBy = user._id;

            for (let i = 0; i < checklist.items.length; i++) {
                if (checklist.items[i].toString() === deletedItem._id.toString()) {
                    checklist.items.splice(i, 1)
                }
            }

            await this.checklistRepo.update(id, checklist, user._id);
            
            await res.json(deletedItem);
        } catch (error) {
            next(error);
        }
    }

    async updateChecklist(req, res, next) {
        let checklist = req.body;
        let id = req.params.id;
        let user = req.user;

        try {
            checklist = await this.checklistRepo.update(id, checklist, user._id);
            
            await res.json(checklist);
        } catch (error) {
            next(error);
        }
    }

    async deleteChecklistById(req, res, next) {
        const id = req.params.id;

        try {
            const checklist = await this.checklistRepo.delete(id);

            await this.itemRepo.deleteManyById(checklist.items);

            const users = await this.userRepo.findAllByChecklistId(id);

            for (let i = 0; i < users.length; i++) {
                const user = users[i];

                for (let k = 0; k < user.checklists.length; k++) {
                    const index = user.checklists.indexOf(id)

                    if (index > -1) {
                        user.checklists.splice(index, 1)

                        await this.userRepo.update(user._id, user);
                    }
                }
            }
            
            await res.json(checklist);
        } catch (error) {
            next(error);
        }
    }
};