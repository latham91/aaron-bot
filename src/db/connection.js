const mongoose = require("mongoose");

const dbConnection = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB connected to database: ${conn.connection.name}`);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

module.exports = dbConnection;
