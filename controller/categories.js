
const asyncHandler = require('express-async-handler');
const Category = require('../models/Category');
const MyError = require('../utils/myError');
const path = require('path');
const paginate = require('../utils/paginate');
const fs = require('fs');


//api/v1/categories GET БҮХ КАТЕГОРИ ДУУДАХ
exports.getCategories = asyncHandler(async (req, res, next) => {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const select = req.query.select;
    ['page', 'limit', 'select'].forEach(el => delete req.query[el]);
    //Pagination
    const pagination = await paginate(Category, page, limit);

    const categories = await Category.find(req.query, select).skip(pagination.start - 1).limit(limit);

    res.status(200).json({
        success: true,
        pagination,
        data: categories
    });
});

//api/v1/categories POST  Шинээр категори зураг, багшийн нэртэй үүсгэх
exports.createCategory = asyncHandler(async (req, res, next) => {

    const file = req.files.file;
    if (!file.mimetype.startsWith('image')) {
        throw new MyError('Та зөвхөн зураг оруулна уу...', 400);
    };
    if (file.size > process.env.MAX_FILE_UPLOAD_PHOTO) {
        throw new MyError('Та зурагны хэмжээ хэтэрсэн байна', 400);
    };

    file.name = `photo_${Date.now()}${path.parse(file.name).ext}`;

    const form = {
        name: req.body.form,
        teacherName: req.body.teacherName,
        photo: file.name
    };
    const category = await Category.create(form);

    file.mv(`${process.env.FILE_UPLOAD_PATH}/` + file.name, err => {
        if (err) {
            throw new MyError('Зургийг хуулах явцад алдаа гарлаа');
        }
    });

    res.status(200).json({
        success: true,
        data: category
    });
});

//api/v1/categories/:id DELETE 
exports.deleteCategory = asyncHandler(async (req, res, next) => {

    const category = await Category.findById(req.params.id);
    if (!category) {
        throw new MyError(`${req.params.id} Ийм IDтай категори байхгүй байна`, 400);
    };

    fs.unlink(`${process.env.FILE_UPLOAD_PATH}/` + category.photo, err => {
        if (err) {
            throw new MyError('Зургийг устгах явцад алдаа гарлаа');
        };

        category.remove();

        res.status(200).json({
            success: true,
            data: category
        });
    });
});



