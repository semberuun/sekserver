const asyncHandler = require('express-async-handler');
const Comment = require('../models/Comment');

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

    const comments = await Comment.find({ category: req.params.categoryID });

    res.status(200).json({
        success: true,
        // pagination,
        data: comments
    });
});




