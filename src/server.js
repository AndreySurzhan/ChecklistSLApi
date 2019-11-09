require('dotenv').config();
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const logging = require('./utils/logging');
const passport = require('passport');
const session = require('express-session');

const env = process.env

//mongoose plugins
const hideDocumentFieldsMongoosePlugin = require('./utils/mongoosePlugins/hideDocumentFields');

const databaseHost = env.DATABASE_HOST
const databasePort = ~~env.DATABASE_PORT
const databaseName = env.DATABASE_NAME
const databaseUser = env.DATABASE_USER
const databasePassword = env.DATABASE_PASSWORD;
const databaseUrl = `mongodb://${databaseUser}:${databasePassword}@${databaseHost}:${databasePort}/${databaseName}`;
const appPort = ~~env.PORT

//expressjs plugins
const errorHandlerExpressjs = require('./utils/expressjsPlugins/errorHandler');

let server;

// register global mongoose plugins
mongoose.plugin(hideDocumentFieldsMongoosePlugin);

let app = express();

// Parse response body as json
app.use(express.json());

app.use(session({
    name: env.CLIENT_WEB_UI_NAME,
    secret: env.CLIENT_WEB_API_SECRET,
    resave: true,
    saveUninitialized: true
}));
app.use(cors());
app.use(passport.initialize());
app.use(passport.session());

// load our routes and pass in our app and fully configured passport
require('../src/routes/routes')(app, express.Router());

// final error handler
app.use(errorHandlerExpressjs);

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