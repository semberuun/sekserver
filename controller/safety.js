const Safety = require('../models/Safety');
const MyError = require('../utils/myError');
const asyncHandler = require('express-async-handler');
const path = require('path');
const fs = require('fs');
const paginate = require('../utils/paginate');

//api/v1/safety GET Бүх технологийн картыг дуудна Хайлт хийх
exports.getSafeties = asyncHandler(async (req, res, next) => {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 30;
    let select = req.query.select || 'all';
    let search = req.query.search || '';

    ['page', 'limit', 'select', 'search'].forEach(el => delete req.query[el]);
    const selectOptions = [
        'airline',
        'kabelline',
        'measurement',
        'station'
    ];
    select === 'all' ? (select = [...selectOptions]) : (select = select.split(","));
    //Pagination
    const pagination = await paginate(Safety, page, limit);

    const safeties = await Safety.find({ cardname: { $regex: search, $options: "i" } }).where('selectedoption').in([...select]).skip(pagination.start - 1).limit(limit);

    res.status(200).json({
        success: true,
        pagination,
        data: safeties
    });
});

//api/v1/safety/:id GET нэг технологийн картыг дуудна
exports.getSafety = asyncHandler(async (req, res, next) => {

    const safety = await Safety.findById(req.params.id);

    if (!safety) {
        throw new MyError(`Ийм ${req.params.id} IDтай технологийн карт байхгүй байна`, 400);
    };

    res.status(200).json({
        success: true,
        data: safety.pdf
    });
});

//api/v1/safety/:id DELETE нэг технологийн картыг устгана
exports.deleteSafety = asyncHandler(async (req, res, next) => {

    const safety = await Safety.findById(req.params.id);
    if (!safety) {
        throw new MyError(`${req.params.id} Ийм IDтай технологийн карт байхгүй байна`, 400);
    };

    fs.unlink(`${process.env.PDFile_UPLOAD_PATH}/` + safety.pdf, err => {
        if (err) {
            throw new MyError('Технологийн картыг устгах явцад алдаа гарлаа');
        };

        safety.remove();

        res.status(200).json({
            success: true,
            data: safety
        });
    });
});

//api/v1/safety POST Нэг технологийн картыг хуулна
exports.createSafety = asyncHandler(async (req, res, next) => {

    if (!req.files) {
        throw new MyError('Та файлаа оруулна уу...', 400);
    };
    if (req.body.selectedoption === 'null') {
        throw new MyError('Та заавал картын агуулгыг сонгоно уу...', 400);
    };

    const file = req.files.file;
    //application/pdf
    if (!file.mimetype.endsWith('pdf')) {
        throw new MyError('Та зөвхөн .pdf файл оруулна уу...', 400);
    };

    file.name = `pdf_${Date.now()}${path.parse(file.name).ext}`;

    const form = {
        cardnumber: req.body.cardnumber,
        cardname: req.body.cardname.toLowerCase(),
        selectedoption: req.body.selectedoption,
        pdf: file.name
    };

    const safety = await Safety.create(form);

    file.mv(`${process.env.PDFile_UPLOAD_PATH}/` + file.name, err => {
        if (err) {
            throw new MyError('PDF file хуулах явцад алдаа гарлаа', 400);
        };
    });

    res.status(200).json({
        success: true,
        data: safety
    })
});



