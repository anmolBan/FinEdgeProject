const express = require('express');
const userRouter = express.Router();
const { createUserController, signinUserController } = require('../controllers/userController');

userRouter.get('/', (req, res) => {
    res.send('User Home Page');
});

userRouter.post('/create', createUserController);
userRouter.post('/signinUser', signinUserController);
module.exports = userRouter;

