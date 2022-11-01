const express = require('express');

const { protect, authorize } = require('../middleware/protect');

const { deletedComment } = require("../controller/comments");

const router = express.Router();

router.route('/:commentId').delete(protect, authorize('admin'), deletedComment);

module.exports = router;


