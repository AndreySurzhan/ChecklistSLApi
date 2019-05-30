const logging = require('../utils/logging');
const translate = require('yandex-translate')(process.env.TRANSLATION_API_KEY);

module.exports = class Translate {

    async translateMany(text, user) {
        let promises = [];

        for (let i = 0; i < user.languages.length; i++) {
            let translationPromise = new Promise((resolve, reject) => {
                translate.translate(text, {
                    to: user.languages[i]
                }, (error, response) => {
                    let translation = {};

                    if (error) {
                        logging.error(`Failed to translate "${text}"`)
                        logging.error(error);

                        reject(error);
                        return;
                    }

                    translation.translation = response.text.join();
                    translation.language = user.languages[i]
                    translation.created = new Date();
                    translation.createdBy = user._id

                    resolve(translation);
                });
            })

            promises.push(translationPromise)
        }

        return Promise.all(promises).then((translations) => {
            return translations
        });
    };
};