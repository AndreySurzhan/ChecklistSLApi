const logging = require('../utils/logging');
const translate = require('google-translate-api');

module.exports = class Translate {
    constructor(user) {
        this.user = user;
    }

    async translateMany(text) {
        let translations = [];

        for (let i = 0; i < languages.length; i++) {
            let translation = {};
            let response;

            try {
                response = await translate(text, {
                    to: languages[i]
                });
                translation.translation = response.text
            } catch (error) {
                logging.error(`Failed to translate "${text}"`)
                logging.error(error);

                return error;
            }

            translation.language = languages[i]
            translation.created = new Date();
            translation.createdBy = this.user._id

            translations.push(translation);
        }

        return translations;
    };
};