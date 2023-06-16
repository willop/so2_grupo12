const express = require('express');
const router = express.Router();

const system = require('../controllers/system');

router.get('/ram', system.ram);
router.get('/cpu', system.cpu);


module.exports = router;