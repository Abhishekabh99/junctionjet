// userRoutes.js

const express = require('express');
const userRouter = express.Router();
const { getAllUsers, getUserById, createUser, updateUser } = require('../controllers/userController');

// Routes

userRouter.post("/create", createUser);
userRouter.put("/:id", updateUser);


module.exports = userRouter;
