const LanguageRepo = require('../repositories/language');


module.exports = class LanguageController {
    constructor() {
        this.languageRepo = new LanguageRepo();
    }

    async findAllLanguages(req, res, next) {
        try {
            const languages = await this.languageRepo.findAll();
            
            await res.json(languages);
        } catch (error) {
            next(error);
        }
    }
};
