const config = require('config');
const ChecklistController = require('../controllers/checklist.js');


module.exports = (router, authenticate) => {
    this.checklistController = new ChecklistController();

    router.post('/checklist', authenticate, (req, res, next) => {
        this.checklistController.addNewChecklist(req.body.checklist, req.user)
            .then((checklist) => {
                res.json(checklist);
            }).catch(() => {
                next(error);
            });
    });

    router.patch('/checklist', authenticate, (req, res, next) => {
        this.checklistController.updateChecklist(req.body.checklist, req.user)
            .then((checklist) => {
                res.json(checklist);
            }).catch(() => {
                next(error);
            });
    });

    router.put('/checklist/:checklistId/item', authenticate, (req, res, next) => {
        this.checklistController.addItemToChecklist(req.body.item, req.user)
            .then((checklist) => {
                res.json(checklist);
            }).catch(() => {
                next(error);
            });
    });
};