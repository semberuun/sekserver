const mongoose = require('mongoose');


const ResisterShema = new mongoose.Schema({
    register: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
},
);

module.exports = mongoose.model('Register', ResisterShema);


