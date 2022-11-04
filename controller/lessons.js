
const asyncHandler = require('express-async-handler');
const fs = require('fs');
const MyError = require('../utils/myError');
const Lesson = require('../models/Lesson');
const Category = require('../models/Category');
const path = require('path');

//api/v1/categories/:categiryID/lessons POST Бичлэг хуулах Хичээл нэмэх
exports.createLesson = asyncHandler(async (req, res, next) => {

    const file = req.files.video;

    if (!file.mimetype.startsWith('video')) {
        throw new MyError('Та бичлэг upload хийнэ үү...', 400);
    };

    file.name = `video_${Date.now()}${path.parse(file.name).ext}`;
    // Файл хуулах
    file.mv(`${process.env.VIDOE_UPLOAD_PATH}/` + file.name, err => {
        if (err) {
            throw new MyError('Бичлэгийг хуулах явцад алдаа гарлаа');
        }
    });

    const form = {
        name: req.body.form,
        video: file.name,
        category: req.params.categoryID,
    };

    const lesson = await Lesson.create(form);

    // Категори модель оруулж хичээл нэмэх тоололт хийж байна
    const category = await Category.findById(req.params.categoryID);
    category.lessonsCount += 1;
    category.save(function (err) {
        if (err) console.log("Алдаа гарлаа хичээл тоололт дээр", err);
        console.log("saved...");
    });

    res.status(200).json({
        success: true,
        data: lesson
    });
});

//api/v1/lessons/:id DELETE
exports.deleteLesson = asyncHandler(async (req, res, next) => {

    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) {
        throw new MyError(`Ийм ${req.params.id} хичээл байхгүй байна`, 400);
    };

    // Категори модель оруулж хичээл хасах тоололт хийж байна
    const category = await Category.findById(lesson.category);
    category.lessonsCount -= 1;
    category.save(function (err) {
        if (err) console.log("Алдаа гарлаа хичээл тоололт дээр", err);
        console.log("saved...");
    });

    lesson.remove();

    res.status(200).json({
        success: true,
        data: lesson
    });
});

//api/v1/categories/:categoryId/lessons GET
exports.getCategoryLessons = asyncHandler(async (req, res, next) => {

    const lessons = await Lesson.find({ category: req.params.categoryID });
    const count = await Lesson.countDocuments({ category: req.params.categoryID });

    //Category-г үзсэн хүмүүсийн тоололт
    const category = await Category.findById(req.params.categoryID);
    category.viewCount += 1;
    category.save(function (err) {
        if (err) console.log("Алдаа гарлаа category тоололт дээр", err);
        console.log("view saved...");
    });

    res.status(200).json({
        success: true,
        count,
        teacherName: category.teacherName,
        data: lessons
    });
});


//http://localhost:8000/api/v1/lessons/video/${res.data.date.video}
exports.lessonPlayVideo = asyncHandler(async (req, res, next) => {

    const range = req.headers.range;

    if (!range) {
        res.status(400).send("Requires Range header");
    };

    const lesson = await Lesson.findById(req.params.id);

    // get video stats (about 61MB)
    const videoPath = `public/video/${lesson.video}`;
    const videoSize = fs.statSync(`public/video/${lesson.video}`).size;

    // Parse Range
    // Example: "bytes=32324-"
    const CHUNK_SIZE = 10 ** 6; // 1MB
    const start = Number(range.replace(/\D/g, ""));
    const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

    // Create headers
    const contentLength = end - start + 1;
    const headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": "video/mp4",
    };

    // HTTP Status 206 for Partial Content
    res.writeHead(206, headers);

    // create video read stream for this particular chunk
    const videoStream = fs.createReadStream(videoPath, { start, end });

    // Stream the video chunk to the client
    videoStream.pipe(res);

});
//http://localhost:8000/video/${res.data.date.video}



