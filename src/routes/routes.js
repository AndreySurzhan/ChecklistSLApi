/// Libs
const passport = require('../auth/passport');
const checklistRoutes = require('./checklist');
const swaggerSpec = require('../swaggerSpec');
const swaggerUi = require('swagger-ui-express');
const userRoutes = require('./user');
const languageRoutes = require('./language');
/// Local variables
let authenticate;

module.exports = (app, router) => {
    authenticate = passport.authenticate('jwt', { session: false });
    authenticateWithPassword = passport.authenticate('local', {
        session: false
    });

    // Register API routes
    router.use('/', swaggerUi.serve);
    router.get('/', swaggerUi.setup(swaggerSpec));

    router.get('/api-docs.json', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggerSpec);
      });

    checklistRoutes(router, authenticate);
    languageRoutes(router, authenticate);
    userRoutes(router, authenticate, authenticateWithPassword);

    // All of our routes will be prefixed with '/api'
    app.use(process.env.BASE_URL, router);
};
