/// Libs
const passport = require('../auth/passport');
const config = require('config');
const checklistRoutes = require('./checklist');
// const itemRoutes = require('./item');
const userRoutes = require('./user');
/// Local variables
let authenticate;

module.exports = (app, router) => {
    authenticate = passport.authenticate('jwt', {session: false});
    authenticateWithPassword = passport.authenticate('local', {session: false});

    // Register API routes
    router.get('/', (req, res) => {
        res.json({
            message: 'Welcome to ChecklistSL'
        });
    });

    checklistRoutes(router, authenticate);
    userRoutes(router, authenticate, authenticateWithPassword);

    // All of our routes will be prefixed with '/api'
    app.use(config.get('baseUrl'), router);
};