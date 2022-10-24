const mongoose = require('mongoose');


const CommentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Хэрэглэгчийн нэрийг заавал оруулна уу!"],
        trim: true,
    },
    phone: {
        type: Number,
        required: [true, 'Хэрэглэгчийн утсыг заавал оруулна уу!'],
    },
    comment: {
        type: String,
        required: [true, "Сэтгэгдэл заавал оруулна уу..."],
        trim: true,
        maxlength: [500000, 'хамгийн багадаа 500000 байх ёстой']
    },
    category: {
        type: mongoose.Schema.ObjectId,
        ref: 'Category',
        required: true,
    },
    createUser: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
},
);




module.exports = mongoose.model('Comment', CommentSchema);