// db.js

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Create a pool without specifying a database name initially
const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME
});

// Function to initialize the database
async function connectDB() {
    try {
        const client = await pool.connect();
        console.log(`DB connected to ${client.database}`);

        // Read and execute the SQL script
        const sqlScriptPath = path.join(__dirname, '..', 'models', 'user.sql');
        const sqlScript = fs.readFileSync(sqlScriptPath, 'utf8');


        await client.query(sqlScript);
        console.log('SQL script executed');

        await client.release();
        console.log("client released")
    } catch (error) {
        console.error('Error initializing database:', error);
        throw error;
    }
}

module.exports = { pool, connectDB };
