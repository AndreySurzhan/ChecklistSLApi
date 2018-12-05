const config = require('config');
const express = require('express');
const mongoose = require('mongoose');
const logging = require('./utils/logging');
const passport = require('passport');
const session = require('express-session');

//mongoose plugins
const hideDocumentFieldsMongoosePlugin = require('./utils/mongoosePlugins/hideDocumentFields');

const databaseHost = config.get(`database.host`);
const databasePort = config.get(`database.port`);
const databaseName = config.get(`database.name`);
const databaseUser = config.get(`database.user`);
const databasePassword = config.get(`database.password`);
const databaseUrl = `mongodb://${databaseUser}:${databasePassword}@${databaseHost}:${databasePort}/${databaseName}`;
const appPort = process.env.PORT || config.get(`port`);
const webApiClient = config.get('clients.webApi');

let server;

// register global mongoose plugins
mongoose.plugin(hideDocumentFieldsMongoosePlugin);

let app = express();

// Parse response body as json
app.use(express.json());

app.use(session({
    name: webApiClient.name,
    secret: webApiClient.secret,
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

// load our routes and pass in our app and fully configured passport
require('../src/routes/routes')(app, express.Router());

// Get Mongoose to use the global promise library
mongoose.Promise = global.Promise;

//To fix all deprecation warnings
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

mongoose.connect(databaseUrl, {
    autoReconnect: true,
    useNewUrlParser: true
}, (error) => {
    if (error) {
        logging.error(error);
        logging.error(`Error happened connecting to mogoseDB '${databaseUrl}'`);
    } else {
        logging.info(`Successfully connected to mongoDB '${databaseUrl}'`);
    }
});

server = app.listen(appPort);
logging.info(`The magic happens on port "${appPort}"`);

module.exports = server;