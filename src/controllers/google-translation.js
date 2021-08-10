const logging = require('../utils/logging');
const { Translate } = require('@google-cloud/translate').v2;

const translate = new Translate();

module.exports = class GoogleTranslate {

    async translateMany(text, user) {
        try {
            const translations = [];
            
            for (const language of user.languages) {
                const translation = await this._translateText(user, text, language);

                translations.push(translation);
            }

            return translations;
        } catch (error) {
            logging.error(`Failed to translate "${text}"`, error);

            throw new Error(error);
        }
    };

    _translateText = async (user, text, language) => {
        const [translatedText] = await translate.translate(text, language)
    
        if(!translatedText) {
            const errorMessage = `Failed to translate "${text}."`;

            logging.error(errorMessage, translations);

            throw new Error(errorMessage);
        };

        const translation = {
            translation: translatedText,
            language: language,
            created: new Date(),
            createdBy: user._id
        }
    
        return translation;
    }
};


