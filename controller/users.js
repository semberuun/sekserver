const User = require('../models/User');
const Category = require('../models/Category');
const MyError = require('../utils/myError');
const asyncHandler = require('express-async-handler');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const paginate = require('../utils/paginate');


//api/v1/user  Бүх хэрэглэгчдийг татах 
exports.getUsers = asyncHandler(async (req, res, next) => {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const select = req.query.select;
    const search = req.query.search || '';

    ['page', 'limit', 'select', 'search'].forEach(el => delete req.query[el]);

    //Pagination
    const pagination = await paginate(User, page, limit);

    const users = await User.find({ phone: { $regex: search } }).skip(pagination.start - 1).limit(limit);
    const userCount = await User.countDocuments();
    const category = await Category.find();

    let array = [];
    category.map(el => {
        array.push(el.lessonsCount);
    });

    const sumCategory = array.length;
    const sumLessons = array.reduce((result, number) => result + number);

    res.status(200).json({
        success: true,
        pagination,
        data: { users, sumCategory, sumLessons, userCount }
    });
});


//register 
exports.register = asyncHandler(async (req, res, next) => {

    const user = await User.create(req.body);

    const token = user.getJsonWebToken();

    res.status(200).json({
        success: true,
        token,
        data: user
    });
});

//login 
exports.userLogin = asyncHandler(async (req, res, next) => {

    const { phone, password } = req.body;

    if (!phone || !password) {
        throw new MyError('Та нэр болон нууц үгээ оруулна уу', 400);
    };

    const user = await User.findOne({ phone: `${phone}` }).select('+password');

    if (!user) {
        throw new MyError('Та нэр болон нууц үгээ зөв оруулна уу...', 401);
    };
    console.log(user.password);

    const ok = await user.checkPassword(password);
    console.log(ok);
    if (!ok) {
        throw new MyError('Та нэр болон нууц үгээ зөв оруулна уу...', 401);
    };

    const token = user.getJsonWebToken();

    res.status(200).json({
        success: true,
        token,
        data: user
    });
});


exports.userLogout = asyncHandler(async (req, res, next) => {

    const tokenOption = {
        expires: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        httpOnly: true
    };

    res.status(200).cookie("token", null, tokenOption).json({
        success: true,
        data: "logout...."
    });
});

//api/v1/user/refresh 
exports.userRefresh = asyncHandler(async (req, res, next) => {

    const user = await User.findById(req.userId);

    if (!user) {
        throw new MyError(`Та заавал логин хийнэ үү...`, 400);
    };

    res.status(200).json({
        success: true,
        data: user
    });
});

// api/v1/user/:id
exports.getUser = asyncHandler(async (req, res, next) => {

    const user = await User.findById(req.params.id);

    if (!user) {
        throw new MyError(`${req.params.id} ID-тай хэрэглэгч байхгүй байна.`, 400);
    };

    res.status(200).json({
        success: true,
        data: user
    });
});

// api/v1/user/:id PUT 
exports.updateUser = asyncHandler(async (req, res, next) => {

    const user = await User.findById(req.params.id);

    if (!user) {
        throw new MyError(`${req.params.id} ID-тай хэрэглэгч байхгүй байна.`, 400);
    };

    const data = user.views;
    data.map(el => {
        if (el === req.body.views) {
            throw new MyError(`${req.body.views} ID-тай хичээл бүртгэгдсэн байна.`, 400);
        }
    });
    data.push(req.body.views);
    user.updateOne({ views: data }, (err) => console.log(err));

    res.status(200).json({
        success: true,
    });
});

//api/v1/user/:id DELETE 
exports.deleteUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        throw new MyError(`${req.params.id} ID-тай хэрэглэгч байхгүй байна.`, 400);
    };

    user.remove();

    res.status(200).json({
        success: true,
        data: user
    });
});

// /api/v1/user/reset-password POST 
exports.resetPassword = asyncHandler(async (req, res, next) => {

    if (!req.body.phone) {
        throw new MyError(`Та утасны дугаараа оруулна уу`, 400);
    };

    const user = await User.findOne({ phone: req.body.phone });

    if (!user) {
        throw new MyError(`${req.body.phone} дугаартай хэрэглэгч байхгүй байна.`, 401);
    };

    user.password = req.body.password;
    user.save();

    res.status(200).json({
        success: true,
        user
    });
});



