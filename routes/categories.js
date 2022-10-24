const express = require('express');
const { protect, authorize } = require('../middleware/protect');

const { getCategories, createCategory, deleteCategory } = require('../controller/categories');

//хичээл нэмэх
const { getCategoryLessons, createLesson } = require('../controller/lessons');

//Комент нэмэх
const { createComment, getCategoryComments } = require('../controller/comments');

const router = express.Router();

router.route('/:categoryID/lessons').get(getCategoryLessons).post(createLesson);
router.route('/:categoryID/comment').get(getCategoryComments).post(createComment);

router.route('/').get(getCategories).post(createCategory);
router.route('/:id').delete(deleteCategory);


module.exports = router;

