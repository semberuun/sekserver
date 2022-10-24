const express = require('express');
const { protect, authorize } = require('../middleware/protect');

const { getSafeties, createSafety, getSafety, deleteSafety } = require("../controller/safety");

const router = express.Router();

router.route('/').get(protect, getSafeties).post(protect, authorize('admin'), createSafety);
router.route('/:id').get(protect, getSafety).delete(protect, authorize('admin'), deleteSafety);


module.exports = router;