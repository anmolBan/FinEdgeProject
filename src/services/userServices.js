const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

async function createUser(data) {
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
        throw new Error('User with this email already exists');
    }
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await User.create({ ...data, password: hashedPassword });
    return user.toObject();
}

async function signinUser(data){
    const user = await User.findOne({ email: data.email });
    if (!user) {
        throw new Error('User with this email does not exist');
    }
    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'defaultsecretkey');
    if (!isPasswordValid) {
        throw new Error('Invalid password');
    }
    return { user: user.toObject(), token };
}

async function getUserById(id) {
    const user = await User.findById(id);
    if (!user) return null;
    return user.toObject();
}

module.exports = { createUser, getUserById, signinUser };