const logging = require('../utils/logging');
const LanguageModel = require('../models/Language');
const Repository = require('./repository');
const NotFoundError = require('../utils/errors').NotFoundError

module.exports = class LanguageRepository extends Repository {
    constructor(){
        super(LanguageModel);
    }

    /**
     * Method that gets all language models
     * 
     * @async
     * @returns {Promise <Query>[]}
     * @memberof LanguageRepository
     */
    async findAll() {
        let languages = null

        try {
            languages = await LanguageModel.find();
        } catch (error) {
            logging.error('Failed to find all languages from database');

            throw error;
        }

        if (!languages) {
            throw new NotFoundError('Languages don\'t exist')
        }

        logging.info('All languages have been successfully found');
        return languages;
    }
}
