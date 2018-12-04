const ChecklistController = require('../controllers/checklist.js');

module.exports = (router, authenticate) => {
    this.checklistController = new ChecklistController();

    router.post('/checklist', authenticate, this.checklistController.addNewChecklist)

    router.patch('/checklist/:id', authenticate, this.checklistController.updateChecklist)

    router.get('/checklist', authenticate, this.checklistController.findChecklistsByUserId)

    router.get('/checklist/:id', authenticate, this.checklistController.findChecklistById)

    router.put('/checklist/:id/item', authenticate, this.checklistController.addItemToChecklist)

    router.patch('/checklist/:id/item/:itemId', authenticate, this.checklistController.updateItemInChecklist)

    router.delete('/checklist/:id/item/:itemId', authenticate, this.checklistController.deleteItemFromChecklist)

    router.delete('/checklist/:id', authenticate, this.checklistController.deleteChecklistById)
};