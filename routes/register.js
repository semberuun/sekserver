const express = require('express');
const { updateRegister, getRegister } = require('../controller/register');

const router = express.Router();

router.route('/').put(updateRegister).get(getRegister);


module.exports = router;