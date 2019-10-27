const ChecklistRepo = require('../../src/repositories/checklist');
const ItemRepo = require('../../src/repositories/item');
const UserRepo = require('../../src/repositories/user');


describe('Integration testing for Repositories', () => {
    beforeAll(() => {
        this.checklistRepo = new ChecklistRepo();
        this.userRepo = new UserRepo();
        this.itemRepo = new ItemRepo();
        this.user = {
            username: `test_${new Date().getTime()}@test.com`,
            password: '123456',
            checklists: [],
            languages: [],
            created: new Date()
        };
        this.item = {
            text: 'Shoes',
            translations: [],
            isChecked: false,
            checklist: null,
            created: new Date(),
            createdBy: null,
            modifiedBy: null
        };
        this.checklist = {
            name: 'Shopping',
            items: [],
            users: [],
            isActive: false,
            created: new Date(),
            createdBy: null,
            modifiedBy: null
        };
    })

    describe('Integration testing for User Repository', () => {
        it('should create new user', async() => {
            let user = await this.userRepo.insert(this.user);

            expect(user).toBeTruthy();
            expect(user.hasOwnProperty('password')).not.toBe(true)

            this.userId = user._id;
            this.checklist.createdBy = this.user._id
            this.checklist.modifiedBy = this.user._id
            this.item.createdBy = this.user._id
            this.item.modifiedBy = this.user._id
        });

        it('should find existing user by id', async() => {
            let user = await this.userRepo.findById(this.userId);

            expect(user).toBeTruthy();
            expect(user.hasOwnProperty('password')).not.toBe(true)
        });

        it('should updated existing user', async() => {
            let user = this.user;
            user.name = `test_updated@${new Date().getTime()}`;
            user.password = "654321";

            user = await this.userRepo.update(this.userId, user);

            expect(user).toBeTruthy();
            expect(user.hasOwnProperty('password')).not.toBe(true)
        });
    });

    describe('Integration testing for Checklist Repository', () => {
        it('should create new checklist', async() => {
            this.checklist.users.push(this.userId);

            let checklist = await this.checklistRepo.insert(this.checklist);

            expect(checklist).toBeTruthy();
            this.checklistId = checklist._id;
        });

        it('should find existing checklists by user id', async() => {
            let checklists = await this.checklistRepo.findAll(this.userId);

            expect(checklists).toBeTruthy();
        });

        it('should updated existing checklist', async() => {
            let checklist = this.checklist;

            checklist.name = `Updated checklist name ${new Date().getTime()}`;
            checklist.isActive = true;
            checklist.modifiedBy = this.userId;

            checklist = await this.checklistRepo.update(this.checklistId, checklist);

            expect(checklist).toBeTruthy();
        });
    });

    describe('Integration testing for Item Repository', () => {
        it('should create new item', async() => {
            let item = await this.itemRepo.insert(this.item);

            expect(item).toBeTruthy();
            this.itemId = item._id;
        });

        it('should find existing items by checklist id', async() => {
            let items = await this.itemRepo.findAll(this.checklistId);

            expect(items).toBeTruthy();
        });

        it('should updated existing item', async() => {
            let item = this.item;

            item.text = 'milk';
            item.isChecked = true;

            item = await this.itemRepo.update(this.itemId, item);

            expect(item).toBeTruthy();
        });

        it('should add translation to existing item', async() => {
            let item = this.item;

            item.translations.push({
                language: 'russian',
                translation: 'молоко',
                created: new Date(),
                createdBy: this.user._id
            })

            item = await this.itemRepo.update(this.itemId, item);

            expect(item).toBeTruthy();
            expect(item.translations.length).toBe(1)
        });
    });
});