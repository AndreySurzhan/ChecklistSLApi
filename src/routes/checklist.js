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

    router.patch('/checklist/:id', authenticate, (req, res, next) => {
        req.body.checklist._id = req.params.id;

        this.checklistController.updateChecklist(req.body.checklist, req.user)
            .then((checklist) => {
                res.json(checklist);
            }).catch(() => {
                next(error);
            });
    });

    router.put('/checklist/:id/item', authenticate, (req, res, next) => {
        this.checklistController.addItemToChecklist(req.params.id, req.item, req.user)
            .then((checklist) => {
                res.json(checklist);
            }).catch(() => {
                next(error);
            });
    });

    router.delete('/checklist/:id', authenticate, (req, res, next) => {
        this.checklistController.deleteChecklistById(req.params.id)
            .then((checklist) => {
                res.json(checklist);
            }).catch(() => {
                next(error);
            });
    });
};