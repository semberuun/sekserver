const express = require('express');
const { protect, authorize } = require('../middleware/protect');

const { deleteLesson, lessonPlayVideo } = require('../controller/lessons');

const router = express.Router();

//api/v1/lessons
router.route('/video/:id').get(lessonPlayVideo);
router.route('/:id').delete(deleteLesson);

module.exports = router;





