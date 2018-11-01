const config = require('config');
const request = require('request');
const UserController = require('../../../src/controllers/user');


describe('Web Api testing for checklist routes', () => {

    beforeAll(async() => {
        const userController = new UserController();

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

        this.addedUser = await userController.addNewUser(this.user);
        this.checklist = {
            name: 'Shopping'
        };
        this.item = {
            text: 'молоко',
            isChecked: false
        };
        this.header = {
            'Authorization': `Bearer ${this.addedUser.token}`
        };
    });

    it('Should add new checklist', (done) => {
        const resource = '/checklist';

        request.post(this.baseUrl + resource, {
            json: this.checklist,
            headers: this.header
        }, (error, response, body) => {
            expect(error).toBe(null);
            expect(response.statusCode).toBe(200);
            expect(body).toBeTruthy();
            expect(body._id).toBeTruthy();

            this.checklistId = body._id;
            this.checklist = body;

            done();
        });
    });

    it('Should update checklist', (done) => {
        const resource = `/checklist/${this.checklistId}`;

        this.checklist.name = `New checklist name ${new Date()}`

        request.patch(this.baseUrl + resource, {
            json: this.checklist,
            headers: this.header
        }, (error, response, body) => {
            expect(error).toBe(null);
            expect(response.statusCode).toBe(200);
            expect(body).toBeTruthy();
            expect(body._id).toBeTruthy();

            this.checklistId = body._id;
            this.checklist = body;

            done();
        });
    });

    it('Should add new item to checklist', (done) => {
        const resource = `/checklist/${this.checklistId}/item`;

        request.put(this.baseUrl + resource, {
            json: this.item,
            headers: this.header
        }, (error, response, body) => {
            expect(error).toBe(null);
            expect(response.statusCode).toBe(200);
            expect(body).toBeTruthy();
            expect(body._id).toBeTruthy();

            this.itemId = body._id;
            this.item = body;

            done();
        });
    });

    it('Should update existing item in checklist', (done) => {
        const resource = `/checklist/${this.checklistId}/item/${this.itemId}`;

        this.item.text = 'buy olive oil'

        request.patch(this.baseUrl + resource, {
            json: this.item,
            headers: this.header
        }, (error, response, body) => {
            expect(error).toBe(null);
            expect(response.statusCode).toBe(200);
            expect(body).toBeTruthy();
            expect(body._id).toBeTruthy();

            this.itemId = body._id;
            this.item = body;

            done();
        });
    });

    it('Should delete existing item from checklist', (done) => {
        const resource = `/checklist/${this.checklistId}/item/${this.itemId}`;

        request.delete(this.baseUrl + resource, {
            headers: this.header
        }, (error, response, body) => {
            expect(error).toBe(null);
            expect(response.statusCode).toBe(200);
            expect(body).toBeTruthy();

            done();
        });
    });

    it('Should delete checklist', (done) => {
        const resource = `/checklist/${this.checklistId}`;

        request.delete(this.baseUrl + resource, {
            headers: this.header
        }, (error, response, body) => {
            expect(error).toBe(null);
            expect(response.statusCode).toBe(200);
            expect(body).toBeTruthy();

            done();
        });
    });
});