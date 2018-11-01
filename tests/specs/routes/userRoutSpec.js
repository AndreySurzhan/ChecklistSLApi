const config = require('config');
const request = require('request');

describe('Web Api testing for user routes', () => {

    beforeAll(async(done) => {
        this.baseUrl = `${config.get('protocol')}://${config.get('host')}:${config.get('port')}${config.get('baseUrl')}`;
        this.user = {
            username: `checklist_Api_${new Date().getTime()}`,
            password: '123456',
            languages: [
                'en',
                'ru',
                'es',
                'de'
            ]
        };

        done();
    })

    it('Should add call base /api', (done) => {
        request.get(this.baseUrl, (error, response, body) => {
            expect(error).toBe(null);
            expect(response.statusCode).toBe(200);

            done();
        });
    });

    it('Should register new user', (done) => {
        let resource = '/registration'

        request.post(this.baseUrl + resource, {
            json: this.user
        }, (error, response, body) => {
            expect(error).toBe(null);
            expect(response.statusCode).toBe(200);
            expect(body).toBeTruthy();

            done();
        });
    });

    it('Should login user and return auth token', (done) => {
        let resource = '/login'

        request.post(this.baseUrl + resource, {
            json: this.user
        }, (error, response, body) => {
            expect(error).toBe(null);
            expect(response.statusCode).toBe(200);
            expect(body).toBeTruthy();

            done();
        });
    });
});