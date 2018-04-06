const TranslationController = require('../../src/controllers/translation');
const UserController = require('../../src/controllers/user');


describe('Integration testing of Translation Controller', () => {

    beforeAll(async() => {
        const userController = new UserController();

        this.user = await userController.addNewUser({
            username: `translationTest_${new Date().getTime()}@test.com`,
            password: 123456,
            languages: [
                'en',
                'ru',
                'es',
                'de'
            ]
        });
        this.translationController = new TranslationController();
    })

    it('should possible to translate text', async() => {
        let translations = await this.translationController.translateMany('buy olive oil', this.user);

        expect(translations).toBeTruthy();
    });
});