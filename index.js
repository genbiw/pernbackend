const express = require("express");
require("dotenv").config();
const { sequelize1, sequelize2 } = require("./db"); // Import the Sequelize instances from db.js
const models = require("./models/models");
const cors = require("cors");
const router = require("./routes/index");
const errorHandler = require("./middleware/ErrorHandlingMiddleware");
const fileupload = require("express-fileupload");
const path = require("path");

const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.resolve(__dirname, "static")));
app.use(fileupload({}));
app.use("/api", router);
app.use(errorHandler); // Error middleware should be last in the chain

const start = async () => {
    try {
        // Attempt connection to the first database
        await sequelize1.authenticate();
        console.log('Connected to the first database successfully.');

        // If the connection to the first database succeeds, start the server
        app.listen(PORT, () => { console.log("Server has started on port:", PORT); });
    } catch (error) {
        console.error('Connection to the first database failed:', error);

        // If connection to the first database fails, attempt connection to the second database
        try {
            await sequelize2.authenticate();
            console.log('Connected to the second database successfully.');

            // If the connection to the second database succeeds, start the server
            app.listen(PORT, () => { console.log("Server has started on port:", PORT); });
        } catch (error) {
            console.error('Connection to the second database failed:', error);
            console.error('Unable to start the server.');
        }
    }
};

start();
