const express = require('express');
const userRouter = express.Router();
const { createUserController, getUserByIdController, signinUserController } = require('../controllers/userController');

userRouter.get('/', (req, res) => {
    res.send('User Home Page');
});

userRouter.post('/create', createUserController);
userRouter.post('/signinUser', signinUserController);
userRouter.get("/:id", getUserByIdController);
module.exports = userRouter;

