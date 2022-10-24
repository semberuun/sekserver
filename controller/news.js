const asyncHandler = require('express-async-handler');
const News = require('../models/News');
const MyError = require('../utils/myError');
const path = require('path');

//api/v1/news POST  Нэг Зар нэмэх 
exports.createNews = asyncHandler(async (req, res, next) => {

    const file = req.files.file;
    console.log(file);
    if (!file.mimetype.startsWith('image')) {
        throw new MyError('Та зураг upload хийнэ үү...', 400);
    };
    if (file.size > process.env.MAX_FILE_UPLOAD_PHOTO) {
        throw new MyError('Та зурагны хэмжээ хэтэрсэн байна', 400);
    };
    file.name = `photo_${Date.now()}${path.parse(file.name).ext}`;
    file.mv(`${process.env.FILE_UPLOAD_PATH}/` + file.name, err => {
        if (err) {
            throw new MyError('Зургийг хуулах явцад алдаа гарлаа');
        }
    });

    const form = {
        name: req.body.name,
        news: req.body.news,
        picture: file.name
    };

    const news = await News.create(form);

    const count = await News.countDocuments();
    if (count === 10) {
        const data = await News.find();
        News.deleteOne({ _id: data[0]._id }, (err) => console.log('post medee ustgah ued aldaa garlaa ' + err));
    };

    res.status(200).json({
        success: true,
        data: news,
        count
    });
});

//api/v1/news GET Бүх зар авах
exports.getNews = asyncHandler(async (req, res, next) => {

    const news = await News.find();

    res.status(200).json({
        success: true,
        data: news
    });
});




