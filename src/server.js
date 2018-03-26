const config = require('config');
const express = require('express');
const mongoose = require('mongoose');
const logging = require('./utils/logging');
const passport = require('passport');
const routes = require('../src/routes/routes');
const session = require('express-session');


const databaseUri = config.get(`database.uri`);
const databasePort = config.get(`database.port`);
const databaseName = config.get(`database.name`);
const databaseUrl = `${databaseUri}:${databasePort}/${databaseName}`;
const appPort = config.get(`port`);
const localClient = config.get('clients.local');

let app = express();

// Parse response body as json
app.use(express.json());

app.use(session({
    name: localClient.name,
    secret: localClient.secret,
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

let server = app.listen(appPort);
logging.info(`The magic happens on port "${appPort}"`);

routes(app, express.Router()); // load our routes and pass in our app and fully configured passport

// Get Mongoose to use the global promise library
mongoose.Promise = global.Promise;

mongoose.connect(databaseUrl, {
    autoReconnect: true
}, (error) => {
    if (error) {
        logging.error(error);
        logging.error(`Error happened connecting to mogoseDB '${databaseUrl}'`);
    } else {
        logging.info(`Successfully connected to mongoDB '${databaseUrl}'`);
    }
});

module.exports = server