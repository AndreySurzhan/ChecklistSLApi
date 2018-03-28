const ChecklistRepo = require('../repositories/checklist');
const ItemRepo = require('../repositories/item');
const UserController = require('../controllers/user');

module.exports = class ChecklistController {

    constructor() {
        this.checklistRepo = new ChecklistRepo();
        this.userController = new UserController();
    }

    async addNewChecklist(checklist, user) {
        let newChecklist;

        try {
            checklist.users = [];
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

    async getAllChecklists(user) {
        return await this.checklistRepo.findAll(user._id);
    }

    async updateChecklist(checklist, user) {
        checklist.modifiedBy = user._id;

        return await this.checklistRepo.update(checklist);
    }

    async deleteChecklistById(id) {
        let itemRepo = new ItemRepo();

        try {
            await itemRepo.deleteAllByChecklistId(id);

            let deletedChecklist = await this.checklistRepo.delete(id);

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