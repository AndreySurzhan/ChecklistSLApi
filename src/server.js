const config = require('config');
const express = require('express');
const mongoose = require('mongoose');
const logging = require('./utils/logging');


const databaseUri = config.get(`database.uri`);
const databasePort = config.get(`database.port`);
const databaseName = config.get(`database.name`);
const databaseUrl = `${databaseUri}:${databasePort}/${databaseName}`;
const appPort = config.get(`port`);

let app = express();

// Parse response body as json
app.use(express.json());

// Add headers
app.use(function(req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'access-control-allow-origin, content-type');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', false);

    // Pass to next layer of middleware
    next();
});

let server = app.listen(appPort);
logging.info(`The magic happens on port "${appPort}"`);

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
}); // connect to our database

module.exports = server