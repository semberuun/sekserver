const mongoose = require('mongoose');

const NewsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Зарын нэрийг заавал оруулна уу!"],
        trim: true,
    },
    news: {
        type: String,
        required: [true, 'Зарыг оруулна уу!'],
        minlength: 50,
        trim: true,
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

module.exports = mongoose.model('News', NewsSchema);

