const UserController = require('../controllers/user.js');

module.exports = (router, authenticate, authenticateWithPassword) => {
    let userController = new UserController();

    /**
     * @swagger
     *
     * /api/registration:
     *   post:
     *     tags:
     *     - user
     *     description: Register new User
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: user
     *         description: User creds
     *         required: true
     *         in: body
     *         schema:
     *           $ref: '#/components/schemas/NewUser'
     *     requestBody:
     *       content:
     *         'application/json':
     *           schema:
     *             $ref: '#/components/schemas/NewUser'
     *     responses:
     *       200:
     *         description: Retrieved User By Id
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/User'
     */
    router.post('/registration', userController.addNewUser.bind(userController));

    /**
     * @swagger
     *
     * /api/login:
     *   post:
     *     tags:
     *     - user
     *     description: Login to the application
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: user
     *         description: User creds
     *         required: true
     *         in: body
     *         schema:
     *           $ref: '#/components/schemas/NewUser'
     *     requestBody:
     *       content:
     *         'application/json':
     *           schema:
     *             $ref: '#/components/schemas/NewUser'
     *     responses:
     *       200:
     *         description: Retrived User By Id
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/User'
     */
    router.post('/login', authenticateWithPassword, userController.loginUser.bind(userController));

    /**
     * @swagger
     *
     * /api/user/{userId}:
     *   get:
     *     tags:
     *     - user
     *     security:
     *      - bearerAuth: []
     *     description: Get existing User by User Id
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: userId
     *         in: path
     *         description: User Id
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Retrived User By Id
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/User'
     */
    router.get('/user/:userId', authenticate, userController.getUserById.bind(userController));
};
