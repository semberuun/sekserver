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



