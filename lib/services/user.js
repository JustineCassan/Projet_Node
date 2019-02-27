'use strict';

const crypter = require('../crypto');
const { Service } = require('schmervice');
const faker = require('faker');

module.exports = class UserService extends Service {

    async getAll() {

        const { User } = this.server.models();

        return await User.query();
    }

    async add(objet) {

        const { User } = this.server.models();
        objet.password = crypter(objet.password);
        return await User.query()
            .insert(objet);
    }

    async getUserById(id) {

        const { User } = this.server.models();

        const response = await User.query().where('id', id);
        return response[0];
    }

    async deleteUser(id) {

        const { User } = this.server.models();

        return await User.query().delete().where('id', '=', id);
    }

    async updateUser(id, user) {

        const { User } = this.server.models();
        user.password = crypter(user.password);
        return await User.query().patch(user).where('id', '=', id);
    }

    async checkUser(login, oldPassword) {

        const { User } = this.server.models();

        const password = crypter(oldPassword);
        return await User.query().where('login', '=', login).andWhere('password', '=',password);
    }

    generation() {

        for (let i = 0; i < 100; i++) {
            const user = {
                login: faker.internet.userName(),
                password: crypter(faker.internet.password()),
                email: faker.internet.email(),
                firstname: faker.name.firstName(),
                lastname: faker.name.lastName(),
                company: faker.company.companyName(),
                function: faker.company.catchPhraseAdjective()
            };
            this.add(user);
        }
    }

    async updatePassword(id, user) {

        const { User } = this.server.models();

        if (user.hasOwnProperty('password')) {
            user.password = crypter(user.password);
        }

        return await User.query()
            .patchAndFetchById(id, user);
    }
};
