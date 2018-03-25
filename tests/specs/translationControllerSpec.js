const TranslationController = require('../../src/controllers/translation');
const UserController = require('../../src/controllers/user');


describe('Integration testing of Translation Controller', () => {

    beforeAll(async() => {
        const userController = new UserController();
        let user = await userController.addNewUser({
            username: `translationTest_${new Date().getTime()}@test.com`,
            password: 123456,
            languages: [
                'en',
                'ru',
                'es',
                'de'
            ]
        });
        this.translationController = new TranslationController(user);
    })

    it('should possible to translate text', async() => {
        let translations = await this.translationController.translateMany('buy olive oil');

        expect(translations).toBeTruthy();
    });
});