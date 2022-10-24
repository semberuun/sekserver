const fs = require('fs');
const mongoose = require('mongoose');
const Category = require('./models/Category');
const Lesson = require('./models/lesson');
const User = require('./models/User');
const dotenv = require('dotenv');
const colors = require('colors');

dotenv.config({ path: './config/config.env' });

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const categories = JSON.parse(fs.readFileSync(__dirname + '/data/categories.json', 'utf-8'));
const lessons = JSON.parse(fs.readFileSync(__dirname + '/data/lesson.json', 'utf-8'));
const users = JSON.parse(fs.readFileSync(__dirname + '/data/user.json', 'utf-8'));

const importData = async () => {
    try {
        await Category.create(categories);
        await Lesson.create(lessons);
        await User.create(users);
    } catch (err) {
        console.log(err);
    };
};

const deleteData = async () => {
    try {
        await Category.deleteMany();
        await Lesson.deleteMany();
        await User.deleteMany();
    } catch (err) {
        console.log(err);
    };
};

if (process.argv[2] == '-i') {
    importData();
    console.log('Дата импортлогдлоо....'.green.inverse);
} else if (process.argv[2] == '-d') {
    deleteData();
    console.log('Дата устлаа....'.red.inverse);
};

