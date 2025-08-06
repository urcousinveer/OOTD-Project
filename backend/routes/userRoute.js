const express = require('express');
const router = express.Router();
const { register, login, logout, getMe } = require('../controller/userC');
const jwt = require("jsonwebtoken");
const userController = require('../controller/userC');

router.post('/register', register);
router.post('/signup', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', getMe);

module.exports = router;
