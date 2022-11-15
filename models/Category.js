const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Категорийн нэрийг заавал оруулна уу!"],
        trim: true,
        unique: true,
    },
    photo: {
        type: String,
        required: [true, "Зураг заавал оруулна уу!"],
        default: "no-photo.jpg",
    },
    teacherName: {
        type: String,
        required: [true, "Багшийн нэрийг заавал оруулна уу!"],
        trim: true,
    },
    lessonsCount: {
        type: Number,
        default: 0
    },
    viewCount: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
},
);

CategorySchema.pre('remove', async function (next) {
    await this.model('Lesson').deleteMany({ category: this._id });
    next();
});

module.exports = mongoose.model('Category', CategorySchema);


