'use strict';

exports.up = function (knex, Promise) {

    return knex
        .schema
        .createTable( 'users', (table) => {

            table.increments().primary();
            table.string( 'login', 250 ).notNullable();
            table.string( 'firstname', 250 ).notNullable();
            table.string( 'lastname', 250 ).notNullable();
            table.string( 'email', 500 ).notNullable();
            table.string( 'password', 25 ).notNullable();
            table.string( 'company', 500 );
            table.string( 'function', 500 );

        });

};

exports.down = function (knex, Promise) {
    return knex
        .schema
        .dropTableIfExists( 'users' );
};
