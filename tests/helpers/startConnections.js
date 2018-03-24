// const config = require('config');
// const logging = require('../../src/utils/logging');
// const mongoose = require('mongoose');
// const server = require('../../src/server');

// const databaseUri = config.get(`database.uri`);
// const databasePort = config.get(`database.port`);
// const databaseName = config.get(`database.name`);
// const databaseUrl = `${databaseUri}:${databasePort}/${databaseName}`;

// mongoose.connect(databaseUrl, {
//     autoReconnect: true
// }, (error) => {
//     if (error) {
//         logging.error(error);
//         logging.error(`Error happened connecting to mogoseDB '${databaseUrl}'`);
//     } else {
//         logging.info(`Successfully connected to mongoDB '${databaseUrl}'`);

//         server.close();
//         server.listen(3000);
//         logging.info('Started web service connection')
//     }
// });