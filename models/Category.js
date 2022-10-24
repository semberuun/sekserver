const mongoose = require('mongoose');
const { slugify } = require('transliteration');

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Категорийн нэрийг заавал оруулна уу!"],
        trim: true,
    },
    slug: String,
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
    // { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// CategorySchema.virtual('lessons', {
//     ref: "Lesson",
//     localField: "_id",
//     foreignField: "category",
//     justOne: false
// })

CategorySchema.pre('save', function (next) {
    this.slug = slugify(this.name);
    next();
});

CategorySchema.pre('remove', async function (next) {
    await this.model('Lesson').deleteMany({ category: this._id });
    next();
});


module.exports = mongoose.model('Category', CategorySchema);


