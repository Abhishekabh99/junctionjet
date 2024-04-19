require('dotenv').config();
const express = require('express');
const { connectDB } = require('./config/db');
const userRouter = require('./routes/userRoute');
const app = express();

// Middleware
app.use(express.json());


// Handling Uncaught Exception
process.on("uncaughtException", (err) => {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to Uncaught Exception`);
    process.exit(1);
});

// Database 
connectDB();


// Routes
app.use("/api/v1/user", userRouter);



app.get("", (req, res) => {
    res.json({ message: 'JunctionJet API is up and running!' });
})



const errorMiddleware = require("./middlewares/error")
app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));


// Unhandled Promise Rejection
process.on("unhandledRejection", (err) => {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to Unhandled Promise Rejection`);

    server.close(() => {
        process.exit(1);
    });
});