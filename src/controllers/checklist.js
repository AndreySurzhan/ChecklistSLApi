const ChecklistRepo = require('../repositories/checklist');
const ItemRepo = require('../repositories/item');
const UserController = reuqire('../controllers/user');

module.exports = class ChecklistController {

    constructor(user) {
        this.checklistRepo = new ChecklistRepo();
        this.user = user;
    }

    async addNewChecklist(checklist) {
        let userController = new UserController();

        try {
            let newChecklist = await this.checklistRepo.inser(checklist);

            this.user.checklists.push(newChecklist._id);

            await userRepo.update(this.user);
        } catch (error) {
            return error;
        }

        return newChecklist
    }

    async getAllChecklists() {
        return await this.checklistRepo.findAll(this.user._id);
    }

    async updateChecklist(checklist) {
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

                        await userController.update(users[i]);
                    }
                }
            }
        } catch (error) {
            return error;
        }

        return deletedChecklist;
    }
};