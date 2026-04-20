const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const userModel = require('../models/userModel');
const AppError = require('../utils/appError');

const login = async (email, password) => {
    const user = await userModel.findByEmail(email);

    // 1. Check if user exists
    if (!user) {
        throw new AppError('Invalid email or password', 401);
    }

    // 2. Check if password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new AppError('Invalid email or password', 401);
    }

    // 3. Generate JWT
    const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET
    );

    // Remove password from output
    delete user.password;

    return { user, token };
};

const registerAdmin = async (username, email, password) => {
    // Check if user already exists
    const existingUser = await userModel.findByEmail(email);
    if (existingUser) {
        throw new AppError('Email already in use', 400);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await userModel.create(username, email, hashedPassword, 'admin');
    return newUser;
};

module.exports = {
    login,
    registerAdmin
};
