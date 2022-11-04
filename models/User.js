const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');


const UserSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: [true, 'Хэрэглэгчийн нэрийг оруулна уу'],
        trim: true
    },
    lastname: {
        type: String,
        required: [true, 'Хэрэглэгчийн нэрийг оруулна уу'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Хэрэглэгчийн имейл оруулна уу'],
        unique: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Имэйл хаяг буруу байна']
    },
    phone: {
        type: String,
        required: [true, 'Хэрэглэгчийн утасыг оруулна уу'],
        unique: true
    },
    role: {
        type: String,
        required: [true, 'Хэрэглэгчийн эрхийг оруулна уу'],
        enum: ['user', 'operator'],
        default: "user"
    },
    right: {
        type: Boolean,
        required: [true, 'Хэрэглэгчийн үзэх эрхийг оруулна уу'],
        default: false
    },
    views: {
        type: [],
        default: [],
        required: true
    },
    password: {
        type: String,
        minlength: 4,
        required: [true, 'Нууц үг оруулна уу'],
        select: false
    },
    ceatedAt: {
        type: Date,
        default: Date.now
    },
});

UserSchema.methods.getJsonWebToken = function () {
    const token = jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRESIN
    });
    return token;
};

UserSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

UserSchema.methods.checkPassword = async function (userPassword) {
    return await bcrypt.compare(userPassword, this.password);
};


module.exports = mongoose.model('User', UserSchema);




