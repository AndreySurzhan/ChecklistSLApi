const LanguageController = require('../controllers/language');

module.exports = (router, authenticate) => {
    const languageController = new LanguageController();

    /**
     * @swagger
     *
     * /api/language:
     *   get:
     *     tags:
     *     - language
     *     security:
     *      - bearerAuth: []
     *     description: Get all Languages by logged in User
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: List of Languages by logged in User
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Language'
     */
    router.get('/language', authenticate, languageController.findAllLanguages.bind(languageController));
};
