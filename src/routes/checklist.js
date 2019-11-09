const ChecklistController = require('../controllers/checklist.js');

module.exports = (router, authenticate) => {
    let checklistController = new ChecklistController();

    /**
     * @swagger
     *
     * /api/checklist:
     *   post:
     *     tags:
     *     - checklist
     *     security:
     *      - bearerAuth: []
     *     description: Create new checklist
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: checklist
     *         description: Checklist name
     *         required: true
     *         in: body
     *         schema:
     *           type: object
     *           properties:
     *             name:
     *               type: string
     *     requestBody:
     *       content:
     *         'application/json':
     *           schema:
     *             type: object
     *             properties:
     *               name:
     *                 type: string
     *     responses:
     *       200:
     *         description: Created Checklist
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Checklist'
     */
    router.post('/checklist', authenticate, checklistController.addNewChecklist.bind(checklistController));

    /**
     * @swagger
     *
     * /api/checklist/{id}:
     *   patch:
     *     tags:
     *     - checklist
     *     security:
     *      - bearerAuth: []
     *     description: Update Existing Checklist
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: id
     *         description: Existing Checklist Id
     *         required: true
     *         in: path
     *         schema:
     *           type: string
     *       - name: checklist
     *         description: Checklist Request Model
     *         required: true
     *         in: body
     *         schema:
     *           $ref: '#/components/schemas/Checklist'
     *     requestBody:
     *       content:
     *         'application/json':
     *           schema:
     *             $ref: '#/components/schemas/Checklist'
     *     responses:
     *       200:
     *         description: Updated checklist
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Checklist'
     */
    router.patch('/checklist/:id', authenticate, checklistController.updateChecklist.bind(checklistController));

    /**
     * @swagger
     *
     * /api/checklist:
     *   get:
     *     tags:
     *     - checklist
     *     security:
     *      - bearerAuth: []
     *     description: Get all Checklists by logged in User
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: List of checklists by logged in User
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Checklist'
     */
    router.get('/checklist', authenticate, checklistController.findChecklistsByUserId.bind(checklistController));

    /**
     * @swagger
     *
     * /api/checklist/{id}:
     *   get:
     *     tags:
     *     - checklist
     *     security:
     *      - bearerAuth: []
     *     description: Get Existing Checklist by Id
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: id
     *         description: Existing Checklist Id
     *         required: true
     *         in: path
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Existing checklist
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Checklist'
     */
    router.get('/checklist/:id', authenticate, checklistController.findChecklistById.bind(checklistController));

    /**
     * @swagger
     *
     * /api/checklist/{id}/item:
     *   put:
     *     tags:
     *     - item
     *     security:
     *      - bearerAuth: []
     *     description: Create New Item
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: id
     *         description: Existing Checklist Id
     *         required: true
     *         in: path
     *         schema:
     *           type: string
     *       - name: item
     *         description: New Item Request Model
     *         required: true
     *         in: body
     *         schema:
     *           $ref: '#/components/schemas/Item'
     *     requestBody:
     *       content:
     *         'application/json':
     *           schema:
     *             $ref: '#/components/schemas/Item'
     *     responses:
     *       200:
     *         description: Created Item
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Item'
     */
    router.put('/checklist/:id/item', authenticate, checklistController.addItemToChecklist.bind(checklistController));

    /**
     * @swagger
     *
     * /api/checklist/{id}/item/{itemId}:
     *   patch:
     *     tags:
     *     - item
     *     security:
     *      - bearerAuth: []
     *     description: Update Existing Item
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: id
     *         description: Existing Checklist Id
     *         required: true
     *         in: path
     *         schema:
     *           type: string
     *       - name: itemId
     *         description: Existing Item Id
     *         required: true
     *         in: path
     *         schema:
     *           type: string
     *       - name: item
     *         description: New Item Request Model
     *         required: true
     *         in: body
     *         schema:
     *           $ref: '#/components/schemas/Item'
     *     requestBody:
     *       content:
     *         'application/json':
     *           schema:
     *             $ref: '#/components/schemas/Item'
     *     responses:
     *       200:
     *         description: Updated Item
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Item'
     */
    router.patch('/checklist/:id/item/:itemId', authenticate, checklistController.updateItemInChecklist.bind(checklistController));

    /**
     * @swagger
     *
     * /api/checklist/{id}/item/{itemId}:
     *   delete:
     *     tags:
     *     - item
     *     security:
     *      - bearerAuth: []
     *     description: Delete Existing Item
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: id
     *         description: Existing Checklist Id
     *         required: true
     *         in: path
     *         schema:
     *           type: string
     *       - name: itemId
     *         description: Existing Item Id
     *         required: true
     *         in: path
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Deleted Item
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Item'
     */
    router.delete('/checklist/:id/item/:itemId', authenticate, checklistController.deleteItemFromChecklist.bind(checklistController));

    /**
     * @swagger
     *
     * /api/checklist/{id}:
     *   delete:
     *     tags:
     *     - checklist
     *     security:
     *      - bearerAuth: []
     *     description: Delete Existing Checklist
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: id
     *         description: Existing Checklist Id
     *         required: true
     *         in: path
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Deleted Item
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Checklist'
     */
    router.delete('/checklist/:id', authenticate, checklistController.deleteChecklistById.bind(checklistController));
};