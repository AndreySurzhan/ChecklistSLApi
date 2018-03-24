const UserRepo = require('../../src/repositories/user')

describe('Integration testing for User Repository', () => {
    beforeAll(() => {
        this.userRepo = new UserRepo();
        this.user = {
            username: `test_${new Date().getTime()}@test.com`,
            password: '123456',
            checklists: [],
            languages: [],
            created: new Date()
        };
        this.id = null;
    })

    it('should create new user', async() => {
        const userRepo = new UserRepo();

        let user = await userRepo.insert(this.user);

        expect(user).toBeTruthy();

        this.id = user._id;
    });

    it('should find existing user by id', async() => {
        let user = await this.userRepo.findById(this.id);

        expect(user).toBeTruthy();
    });

    it('should updated existing user', async() => {
        let user = this.user;
        user._id = this.id;
        user.name = `test_updated@${new Date().getTime()}`;
        user.password = "654321";

        user = await this.userRepo.update(user);

        expect(user).toBeTruthy();
    });
});