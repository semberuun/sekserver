const express = require('express');
const { protect, authorize } = require('../middleware/protect');

const { getCategories, createCategory, deleteCategory } = require('../controller/categories');

//хичээл нэмэх
const { getCategoryLessons, createLesson } = require('../controller/lessons');

//Комент нэмэх
const { createComment, getCategoryComments } = require('../controller/comments');

const router = express.Router();

router.route('/:categoryID/lessons').get(protect, getCategoryLessons).post(protect, createLesson);
router.route('/:categoryID/comment').get(protect, getCategoryComments).post(protect, createComment);

router.route('/').get(protect, getCategories).post(protect, authorize('admin'), createCategory);
router.route('/:id').delete(protect, authorize('admin'), deleteCategory);


module.exports = router;

