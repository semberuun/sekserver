const mongoose = require('mongoose');

const SafetySchema = new mongoose.Schema({
    cardnumber: {
        type: String,
        required: [true, 'Технологийн картын дугаарыг оруулна уу'],
        trim: true
    },
    cardname: {
        type: String,
        required: [true, 'Технологийн картын нэрийг оруулна уу'],
        trim: true
    },
    selectedoption: {
        type: [String],
        required: [true, "Агуулгыг заавал оруулна уу!"]
    },
    pdf: {
        type: String,
        required: [true, "PDF файл заавал оруулна уу!"],
        trim: true
    },
    ceatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Safety', SafetySchema);



