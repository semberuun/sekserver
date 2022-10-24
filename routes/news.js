const express = require('express');

const router = express.Router();

const { createNews, getNews } = require('../controller/news');

router.route('/').post(createNews).get(getNews);

module.exports = router;



