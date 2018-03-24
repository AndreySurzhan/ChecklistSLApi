const config = require('./support/jasmine');
const Jasmine = require('jasmine');
const logging = require('../src/utils/logging');
const mongoose = require('mongoose');
const server = require('../src/server')
const SpecReporter = require('jasmine-spec-reporter');

const jasmine = new Jasmine();

jasmine.loadConfig(config);
jasmine.clearReporters();
jasmine.addReporter(new SpecReporter());

jasmine.onComplete(function(passed) {
    mongoose.disconnect(() => {
        logging.info('Closed out remaining database connections');
        server.close(function() {
            logging.info('Closed out remaining web server connections');
            if (passed) {
                process.exit();
            } else {
                process.exit(1);
            }
        });
    });
});


jasmine.execute();