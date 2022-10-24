const mongoose = require('mongoose');
const { slugify } = require('transliteration');

const NewsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Зарын нэрийг заавал оруулна уу!"],
        trim: true,
    },
    slug: String,
    news: {
        type: String,
        required: [true, 'Зарыг оруулна уу!'],
        minlength: 50
    },
    picture: {
        type: String,
        required: [true, "Зураг заавал оруулна уу!"],
        default: "no-photo.jpg",
    },
    ceatedAt: {
        type: Date,
        default: Date.now
    },
});

NewsSchema.pre('save', function (next) {
    this.slug = slugify(this.name);
    next();
});

module.exports = mongoose.model('News', NewsSchema);

