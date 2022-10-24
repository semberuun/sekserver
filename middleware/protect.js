const asyncHandler = require('express-async-handler');
const MyError = require('../utils/myError');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.protect = asyncHandler(async (req, res, next) => {

    let token = null;

    if (req.headers.authorization) {
        token = req.headers.authorization.split(' ')[1];
    };
    // else if (req.cookies) {
    //     token = req.cookies['token'];
    // };

    if (!token) {
        throw new MyError('Таны заавал логин хийнэ үү', 401);
    };
    //Token буруу байхын бол exeption шиднэ
    const tokenObj = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = tokenObj.id;
    req.userRole = tokenObj.role;

    next();
});

exports.authorize = (...roles) => {
    return asyncHandler((req, res, next) => {
        console.log(roles);
        if (!roles.includes(req.userRole)) {
            throw new MyError('Таны ' + req.userRole + ' эрх хүрэхгүй байна', 403);
        };
        next();
    });
};
