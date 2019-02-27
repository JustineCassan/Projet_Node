'use strict';


const UserSchema = require('../schemas/userSchema');
const Joi = require('joi');

module.exports = [
    {
        method  : 'PUT',
        path    : '/users/update/{id}',
        options : {
            tags : ['api'],
            validate : {
                params : {
                    id : Joi.number().integer().required()

                },
                query : Joi.object({
                    login: Joi.string().token(),
                    password: Joi.string().regex(/^[a-zA-Z0-9]{6,16}$/).min(8)
                }).or('login', 'password')
            }
        },

        async handler(request, h) {

            const { userService } = request.services();
            const { mailService } = request.services();

            const oldUser = await userService.getUserById(request.params.id);
            const newUser  = {};
            let password;

            if (request.query.login && oldUser.login !== request.query.login) {
                newUser.login = request.query.login;
            }

            if (request.query.password && oldUser.password !== request.query.password) {
                newUser.password = request.query.password;
                password = request.query.password;
            }

            if (newUser.login || newUser.password){
                const savedUser = await userService.updatePassword(request.params.id, newUser);
                if (newUser.password) {
                    newUser.password = password;
                }

                console.log(newUser);
                await mailService.sendMailsChange(savedUser, newUser);

                return h.response('mail envoyé').code(201);
            }

            return 'ok';
        }
    },
    {
        method  : 'GET',
        path    : '/users',
        options : {
            tags : ['api']
        },
        async handler(request, h) {

            const { userService } = request.services();

            return await userService.getAll();
        }
    },
    {
        method  : 'POST',
        path    : '/users',
        options : {
            tags : ['api'],
            validate : {
                payload : UserSchema
            }
        },
        async handler(request, h) {

            const { userService } = request.services();
            const { mailService } = request.services();

            await mailService.sendMails(request.payload);

            return await userService.add(request.payload);
        }
    },
    {
        method  : 'GET',
        path    : '/users/{id}',
        options : {
            tags : ['api'],
            validate : {
                params : {
                    id : Joi.number().integer().required()
                }
            }
        },
        async handler(request, h) {

            const { userService } = request.services();

            return await userService.getUserById(request.params.id);
        }
    },
    {
        method  : 'DELETE',
        path    : '/users/{id}',
        options : {
            tags : ['api'],
            validate : {
                params : {
                    id : Joi.number().required()
                }
            }
        },
        async handler(request, h) {

            const { userService } = request.services();
            return await userService.deleteUser(request.params.id);
        }
    },
    {
        method : 'PUT',
        path    : '/users/{id}',
        options : {
            tags : ['api'],
            validate : {
                payload : UserSchema,
                params : {
                    id : Joi.number().required()
                }
            }
        },
        async handler(request, h) {

            const { userService } = request.services();
            return await userService.updateUser(request.params.id, request.payload);
        }
    },
    {
        method : 'POST',
        path    : '/users/generate',
        options : {
            tags : ['api']
        },
        async handler(request, h) {

            const { userService } = request.services();
            const tabUser = userService.generation();
            return await userService.insertGeneration(tabUser);
        }
    },
    {
        method: 'POST',
        path: '/auth/{login}/{password}',
        options: {
            tags: ['api'],
            validate : {
                params: {
                    login: Joi.string().required(),
                    password: Joi.string().regex(/^[a-zA-Z0-9]{6,16}$/).min(8).required()
                }
            }
        },
        async handler(request, h) {

            const { userService } = request.services();
            const results = await userService.checkUser(request.params.login, request.params.password);
            if (results.length === 0) {
                return h.response('{ msg : \'ko\' }').code(404);
            }

            return h.response('{ msg : \'ok\' }').code(204);


        }
    }
];
