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
        }
    });

    it('Should add new checklist', (done) => {
        const resource = '/checklist';

        let requestBody = {
            checklist: this.checklist,
            password: this.user.password,
            username: this.addedUser.username
        };

        request.post(this.baseUrl + resource, {
            json: requestBody
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

        let requestBody = {
            checklist: this.checklist,
            password: this.user.password,
            username: this.addedUser.username
        };

        request.patch(this.baseUrl + resource, {
            json: requestBody
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

        let requestBody = {
            item: this.item,
            password: this.user.password,
            username: this.addedUser.username
        }

        request.put(this.baseUrl + resource, {
            json: requestBody
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

        let requestBody = {
            item: this.item,
            password: this.user.password,
            username: this.addedUser.username
        }

        request.patch(this.baseUrl + resource, {
            json: requestBody
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

        let requestBody = {
            password: this.user.password,
            username: this.addedUser.username
        }
        request.delete(this.baseUrl + resource, {
            json: requestBody
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

    it('Should delete checklist', (done) => {
        const resource = `/checklist/${this.checklistId}`;

        let requestBody = {
            password: this.user.password,
            username: this.addedUser.username
        }
        request.delete(this.baseUrl + resource, {
            json: requestBody
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
});