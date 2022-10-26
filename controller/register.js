const asyncHandler = require('express-async-handler');
const Register = require('../models/Register');
const MyError = require('../utils/myError');

exports.updateRegister = asyncHandler(async (req, res, next) => {

    const register = await Register.find();
    if (register[0]) {
        register[0].register = !register[0].register;
        register[0].save(function (err) {
            if (err) console.log("Алдаа гарлаа register хадгалж чадсангүй", err);
        });
        res.status(200).json({
            success: true,
            data: register[0].register
        });
    } else {
        const register = await Register.create({ register: false });
        res.status(200).json({
            success: true,
            data: register.register
        });
    };
});

exports.getRegister = asyncHandler(async (req, res, next) => {
    const variable = await Register.find();
    if (!variable[0]) {
        throw new MyError('Бүртгэл эхлүүлэх дата баазад үүсэгүй бна', 400);
        // res.end();
    } else {
        res.status(200).json({
            success: true,
            data: variable[0].register
        });
    }
});

