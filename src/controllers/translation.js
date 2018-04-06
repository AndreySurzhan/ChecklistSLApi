const logging = require('../utils/logging');
const translate = require('google-translate-api');

module.exports = class Translate {

    async translateMany(text, user) {
        let translations = [];

        for (let i = 0; i < user.languages.length; i++) {
            let translation = {};
            let response;

            try {
                response = await translate(text, {
                    to: user.languages[i]
                });
            } catch (error) {
                logging.error(`Failed to translate "${text}"`)
                logging.error(error);

                return error;
            }

            translation.translation = response.text
            translation.language = user.languages[i]
            translation.created = new Date();
            translation.createdBy = user._id

            translations.push(translation);
        }

        return translations;
    };
};