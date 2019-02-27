'use strict';

const crypto = require('crypto');

module.exports = function crypter(mdp){
    const hmac = crypto.createHmac('sha256', mdp);
    return hmac;
};
