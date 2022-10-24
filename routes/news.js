const express = require('express');
const { protect, authorize } = require('../middleware/protect');

const router = express.Router();

const { createNews, getNews } = require('../controller/news');

router.route('/').post(protect, authorize('admin'), createNews).get(getNews);

module.exports = router;



