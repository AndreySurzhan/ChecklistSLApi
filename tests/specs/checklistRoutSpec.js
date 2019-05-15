const request = require('request');

describe('Web Api testing for checklist routes', () => {
    beforeAll(async () => {
        const env = process.env;
        this.baseUrl = `${env.PROTOCOL}://${env.HOST}:${env.PORT}${env.BASE_URL}`;
        this.user = {
            username: `checklist_Api_${new Date().getTime()}`,
            password: '123456',
            languages: ['en', 'ru', 'es', 'de']
        };
        this.checklist = {
            name: 'Shopping'
        };
        this.item = {
            text: 'молоко',
            isChecked: false
        };
    });

    it('Should add call base /api', done => {
        request.get(this.baseUrl, (error, response, body) => {
            expect(error).toBe(null);
            expect(response.statusCode).toBe(200);

            done();
        });
    });

    it('Should register new user', done => {
        let resource = '/registration';

        request.post(
            this.baseUrl + resource,
            {
                json: this.user
            },
            (error, response, body) => {
                expect(error).toBe(null);
                expect(response.statusCode).toBe(200);
                expect(body).toBeTruthy();

                done();
            }
        );
    });

    it('Should login user and return auth token', done => {
        let resource = '/login';

        request.post(
            this.baseUrl + resource,
            {
                json: this.user
            },
            (error, response, body) => {
                expect(error).toBe(null);
                expect(response.statusCode).toBe(200);
                expect(body).toBeTruthy();

                this.addedUser = body;

                done();
            }
        );
    });

    it('Should add new checklist', done => {
        const resource = '/checklist';
        this.header = {
            Authorization: `Bearer ${this.addedUser.token}`
        };

        request.post(
            this.baseUrl + resource,
            {
                json: this.checklist,
                headers: {
                    Authorization: `Bearer ${this.addedUser.token}`
                }
            },
            (error, response, body) => {
                expect(error).toBe(null);
                expect(response.statusCode).toBe(200);
                expect(body).toBeTruthy();
                expect(body._id).toBeTruthy();

                this.checklistId = body._id;
                this.checklist = body;

                done();
            }
        );
    });

    it('Should get existing checklist', done => {
        const resource = `/checklist/${this.checklistId}`;

        request.get(
            this.baseUrl + resource,
            {
                headers: {
                    Authorization: `Bearer ${this.addedUser.token}`
                }
            },
            (error, response, body) => {
                expect(error).toBe(null);
                expect(response.statusCode).toBe(200);
                expect(body).toBeTruthy();

                done();
            }
        );
    });

    it('Should get all existing checklists by user id', done => {
        const resource = `/checklist`;

        request.get(
            this.baseUrl + resource,
            {
                headers: {
                    Authorization: `Bearer ${this.addedUser.token}`
                }
            },
            (error, response, body) => {
                expect(error).toBe(null);
                expect(response.statusCode).toBe(200);
                expect(body).toBeTruthy();

                done();
            }
        );
    });

    it('Should update checklist', done => {
        const resource = `/checklist/${this.checklistId}`;

        this.checklist.name = `New checklist name ${new Date()}`;

        request.patch(
            this.baseUrl + resource,
            {
                json: this.checklist,
                headers: {
                    Authorization: `Bearer ${this.addedUser.token}`
                }
            },
            (error, response, body) => {
                expect(error).toBe(null);
                expect(response.statusCode).toBe(200);
                expect(body).toBeTruthy();
                expect(body._id).toBeTruthy();

                this.checklistId = body._id;
                this.checklist = body;

                done();
            }
        );
    });

    it('Should add new item to checklist', done => {
        const resource = `/checklist/${this.checklistId}/item`;

        request.put(
            this.baseUrl + resource,
            {
                json: this.item,
                headers: {
                    Authorization: `Bearer ${this.addedUser.token}`
                }
            },
            (error, response, body) => {
                expect(error).toBe(null);
                expect(response.statusCode).toBe(200);
                expect(body).toBeTruthy();
                expect(body._id).toBeTruthy();

                this.itemId = body._id;
                this.item = body;

                done();
            }
        );
    });

    it('Should update existing item in checklist', done => {
        const resource = `/checklist/${this.checklistId}/item/${this.itemId}`;

        this.item.text = 'buy olive oil';

        request.patch(
            this.baseUrl + resource,
            {
                json: this.item,
                headers: {
                    Authorization: `Bearer ${this.addedUser.token}`
                }
            },
            (error, response, body) => {
                expect(error).toBe(null);
                expect(response.statusCode).toBe(200);
                expect(body).toBeTruthy();
                expect(body._id).toBeTruthy();

                this.itemId = body._id;
                this.item = body;

                done();
            }
        );
    });

    it('Should delete existing item from checklist', done => {
        const resource = `/checklist/${this.checklistId}/item/${this.itemId}`;

        request.delete(
            this.baseUrl + resource,
            {
                headers: {
                    Authorization: `Bearer ${this.addedUser.token}`
                }
            },
            (error, response, body) => {
                expect(error).toBe(null);
                expect(response.statusCode).toBe(200);
                expect(body).toBeTruthy();

                done();
            }
        );
    });

    it('Should delete checklist', done => {
        const resource = `/checklist/${this.checklistId}`;

        request.delete(
            this.baseUrl + resource,
            {
                headers: {
                    Authorization: `Bearer ${this.addedUser.token}`
                }
            },
            (error, response, body) => {
                expect(error).toBe(null);
                expect(response.statusCode).toBe(200);
                expect(body).toBeTruthy();

                done();
            }
        );
    });
});
