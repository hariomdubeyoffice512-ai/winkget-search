const express = require('express');
const router = express.Router();
const { updatePersonalInfo, getMe } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

router.get('/me', protect, getMe);
router.put('/update', protect, updatePersonalInfo);

module.exports = router;