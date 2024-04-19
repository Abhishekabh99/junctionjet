// userController.js

const { pool } = require("../config/db");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const ErrorHandler = require("../utils/errorhandler");

// Create user
exports.createUser = catchAsyncErrors(async (req, res, next) => {

    const { username, email, password, bio, profile_picture, social_links } = req.body;

    // Check if user with the provided email or username already exists
    const checkQuery = "SELECT * FROM users WHERE email = $1 OR username = $2";
    const checkValues = [email, username];
    const checkResult = await pool.query(checkQuery, checkValues);

    if (checkResult.rows.length > 0) {
        return next(new ErrorHandler("User with the provided email or username already exists", 400));
    }

    // If user does not exist, proceed with user creation

    // VALUES ($1, $2, $3, $4, $5, $6): This part of the query specifies the values to be inserted into each column. The values are parameterized using $1, $2, $3, $4, $5, and $6. These placeholders will be replaced with actual values provided in the values array when the query is executed.

    // RETURNING *: This clause instructs PostgreSQL to return the inserted row after the INSERT operation is completed. It allows us to retrieve the newly created user record immediately after insertion

    const insertQuery = "INSERT INTO users (username, email, password, bio, profile_picture, social_links) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *";
    const insertValues = [username, email, password, bio, profile_picture, social_links];

    const result = await pool.query(insertQuery, insertValues);
    const user = result.rows[0];
    res.status(201).json({
        success: true,
        user
    });
});


// Update user
exports.updateUser = catchAsyncErrors(async (req, res, next) => {
    const userId = req.params.id;
    const { username, email, password, bio, profile_picture, social_links } = req.body;
    const query = "UPDATE users SET username = $1, email = $2, password = $3, bio = $4, profile_picture = $5, social_links = $6 WHERE id = $7 RETURNING *";
    const values = [username, email, password, bio, profile_picture, social_links, userId];

    try {
        const result = await pool.query(query, values);
        if (result.rowCount === 0) {
            return next(new ErrorHandler("User not found", 404));
        }
        const updatedUser = result.rows[0];
        res.status(200).json({
            success: true,
            updatedUser
        });
    } catch (error) {
        next(new ErrorHandler("Error updating user", 500));
    }
});

// Get single user
exports.getOneUser = catchAsyncErrors(async (req, res, next) => {
    const userId = req.params.id;
    const query = "SELECT * FROM users WHERE id = $1";
    const values = [userId];

    try {
        const result = await pool.query(query, values);
        if (result.rowCount === 0) {
            return next(new ErrorHandler("User not found", 404));
        }
        const user = result.rows[0];
        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        next(new ErrorHandler("Error fetching user", 500));
    }
});

// Delete user
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
    const userId = req.params.id;
    const query = "DELETE FROM users WHERE id = $1";
    const values = [userId];

    try {
        const result = await pool.query(query, values);
        if (result.rowCount === 0) {
            return next(new ErrorHandler("User not found", 404));
        }
        res.status(200).json({
            success: true,
            message: "User deleted"
        });
    } catch (error) {
        next(new ErrorHandler("Error deleting user", 500));
    }
});

// Get all users
exports.getAllUsers = catchAsyncErrors(async (req, res, next) => {
    const query = "SELECT * FROM users";

    try {
        const result = await pool.query(query);
        const users = result.rows;
        res.status(200).json({
            success: true,
            users
        });
    } catch (error) {
        next(new ErrorHandler("Error fetching users", 500));
    }
});
