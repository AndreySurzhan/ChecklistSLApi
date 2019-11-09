const logging = require('../logging');
const mongooseError = require('mongoose').Error;
const errorHandler = function(err, req, res, next) {
    //parse error type and add status to it
    if (!err.name) {
        err.statusCode = 500;
    }else if (err.name && err.name === mongooseError.ValidationError.name) {
        err.statusCode = 400;
    } else if (err.name && err.name === mongooseError.DocumentNotFoundError.name) {
        err.statusCode = 404;
    } else if (err.name && err.name === mongooseError.CastError.name && err.path === '_id') {
        err.statusCode = 404;
    } else if (err.name && err.name === mongooseError.CastError.name) {
        err.statusCode = 400;
    } else if (err.name && err.name === 'MongoError' && err.message.indexOf('E11000') > -1) {
        err.statusCode = 400;
    } else if (!err.statusCode) {
        err.statusCode = 500;
    }

    logging.error(err);
    res.status(err.statusCode).send(err.message);
};

module.exports = errorHandler;