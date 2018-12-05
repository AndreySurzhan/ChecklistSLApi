const ChecklistController = require('../controllers/checklist.js');

module.exports = (router, authenticate) => {
    let checklistController = new ChecklistController();

    router.post('/checklist', authenticate, checklistController.addNewChecklist.bind(checklistController));

    router.patch('/checklist/:id', authenticate, checklistController.updateChecklist.bind(checklistController));

    router.get('/checklist', authenticate, checklistController.findChecklistsByUserId.bind(checklistController));

    router.get('/checklist/:id', authenticate, checklistController.findChecklistById.bind(checklistController));

    router.put('/checklist/:id/item', authenticate, checklistController.addItemToChecklist.bind(checklistController));

    router.patch('/checklist/:id/item/:itemId', authenticate, checklistController.updateItemInChecklist.bind(checklistController));

    router.delete('/checklist/:id/item/:itemId', authenticate, checklistController.deleteItemFromChecklist.bind(checklistController));

    router.delete('/checklist/:id', authenticate, checklistController.deleteChecklistById.bind(checklistController));
};