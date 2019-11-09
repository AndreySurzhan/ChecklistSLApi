const winston = require('winston');

const logger = new winston.Logger({
    transports: [
        new winston.transports.Console({
            handleExceptions: true,
            level: process.env.LOGGING_LEVEL,
            timestamp: true,
            humanReadableUnhandledException: true,
            colorize: true
        }),
    ],
    exitOnError: false
});

module.exports = logger;
