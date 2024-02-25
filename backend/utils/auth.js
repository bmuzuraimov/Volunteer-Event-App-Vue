const jwt = require('jsonwebtoken');
const { AuthorizationError } = require('./error_handler');

// generate a token
const generateToken = function (user) {
    return jwt.sign(user, process.env.TOKEN_SECRET, {
        expiresIn: 86400 // expires in 24 hours
    });
}

const isVolunteer = function (req, res, next) {
    if (req.authInfo.scope !== 'volunteer') {
        throw new AuthorizationError("Unauthorized: Volunteer role required");
    }
    next();
};

const isAdmin = function (req, res, next) {
    if (req.authInfo.scope !== 'admin') {
        throw new AuthorizationError("Unauthorized: Admin role required");
    }
    next();
};

module.exports = { generateToken, isAdmin, isVolunteer };