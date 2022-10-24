const express = require('express');

const { getSafeties, createSafety, getSafety, deleteSafety } = require("../controller/safety");

const router = express.Router();

router.route('/').get(getSafeties).post(createSafety);
router.route('/:id').get(getSafety).delete(deleteSafety);


module.exports = router;