const mongoose = require('mongoose');

const LessonSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Хичээлийн нэрийг оруулна уу..."],
        trim: true,
        unique: true,
    },
    video: {
        type: String,
        default: "no-video",
    },
    audio: {
        type: String,
        default: "no-audio",
    },
    // author: {
    //     type: String,
    //     required: [true, "Зориогчийн нэрийг оруулна уу..."],
    //     trim: true,
    //     default: "no-audio",
    // },
    // content: {
    //     type: String,
    //     required: [true, "Хичээлийн тайлбарыг оруулна уу..."],
    //     trim: true,
    //     maxlength: [500000, 'хамгийн багадаа 500000 байх ёстой'],
    //     default: "no-audio",
    // },
    category: {
        type: mongoose.Schema.ObjectId,
        ref: 'Category',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});


module.exports = mongoose.model('Lesson', LessonSchema);



