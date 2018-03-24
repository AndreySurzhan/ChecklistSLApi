const winston = require('winston');
const config = require('config');

const logger = new winston.Logger({
    transports: [
        new winston.transports.Console({
            handleExceptions: true,
            level: config.get('loggingLevel'),
            timestamp: true,
            humanReadableUnhandledException: true,
            colorize: true
        }),
    ],
    exitOnError: false
});

module.exports = logger;