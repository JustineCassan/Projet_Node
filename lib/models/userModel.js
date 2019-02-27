'use strict';

const { Model } = require('objection');
const UserSchema = require('../schemas/userSchema');

module.exports = class User extends Model {

    static get tableName() {

        return 'users';
    }

    static get joiSchema() {

        return UserSchema;
    }
};
