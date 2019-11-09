const TranslationController = require('../../src/controllers/translation');

describe('Integration testing of Translation Controller', () => {

    beforeAll(async() => {
        this.user = {
            languages: ["ru", "en"]
        };
        this.translationController = new TranslationController();
    })

    it('should possible to translate text', async() => {
        let translations = await this.translationController.translateMany('buy olive oil', this.user);

        expect(translations).toBeTruthy();
    });
});