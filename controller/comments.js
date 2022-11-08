const asyncHandler = require('express-async-handler');
const Comment = require('../models/Comment');
const paginate = require('../utils/paginate');

// category/:categoryId/comment POST Нэг категорилуу сэтгэгдэл бичих
exports.createComment = asyncHandler(async (req, res, next) => {
    const form = {
        name: req.body.name,
        phone: req.body.phone,
        comment: req.body.comment,
        createUser: req.body.user,
        category: req.params.categoryID,
    };
    const comment = await Comment.create(form);

    res.status(200).json({
        success: true,
        data: comment
    });
});

// category/:categoryId/comment GET Нэг категорийн бүх сэтгэгдэл авах
exports.getCategoryComments = asyncHandler(async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    ['page', 'limit'].forEach(el => delete req.query[el]);

    const pagination = await paginate(Comment.find({ category: req.params.categoryID }), page, limit);

    const comments = await Comment.find({ category: req.params.categoryID }).skip(pagination.start - 1).limit(limit);

    if (!comments) {
        throw new MyError(`Ийм ${req.params.categoryID} комментууд байхгүй байна`, 400);
    };

    res.status(200).json({
        success: true,
        pagination,
        data: comments.reverse()
    });
});


//api/v1/comment DELETE нэг сэтгэгдэл устгах
exports.deletedComment = asyncHandler(async (req, res, next) => {

    const comment = await Comment.findByIdAndRemove(req.params.commentId);

    if (!comment) {
        throw new MyError(`Ийм ${req.params.categoryID} коммент байхгүй байна`, 400);
    };

    res.status(200).json({
        success: true,
        data: comment
    });
})



