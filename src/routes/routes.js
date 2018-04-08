/// Libs
const passport = require('../auth/passport');
const config = require('config');
const checklistRoutes = require('./checklist');
// const itemRoutes = require('./item');
const userRoutes = require('./user');
/// Local variables
let authenticate;

module.exports = (app, router) => {
    authenticate = passport.authenticate('local');

    // Register API routes
    router.get('/', function(req, res) {
        res.json({
            message: 'Welcome to ChecklistSL'
        });
    });

    checklistRoutes(router, authenticate);
    userRoutes(router, authenticate);

    // All of our routes will be prefixed with '/api'
    app.use(config.get('baseUrl'), router);
};