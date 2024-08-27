const express = require("express");
require("dotenv").config();
const { sequelize1, sequelize2 } = require("./db");
const cors = require("cors");
const fileupload = require("express-fileupload");
const path = require("path");
const errorHandler = require("./middleware/ErrorHandlingMiddleware");

const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.resolve(__dirname, "static")));
app.use(fileupload({}));
app.use(errorHandler); // Error middleware should be last in the chain

let activeSequelize = null; // Global variable for the active Sequelize instance

const checkReadOnly = async (sequelize) => {
    try {
        const [result] = await sequelize.query('SELECT pg_is_in_recovery();');
        console.log('Database read-only check result:', result);
        return result[0].pg_is_in_recovery; // Returns true if read-only
    } catch (error) {
        console.error('Failed to check read-only status:', error);
        return false;
    }
};

const start = async () => {
    try {
        // Check if the first database is writable
        const isReadOnly = await checkReadOnly(sequelize1);
        if (isReadOnly) {
            console.log('First database is in read-only mode. Attempting connection to the second database.');
            throw new Error('First database is read-only or failed.');
        } else {
            await sequelize1.authenticate(); // Authenticate only if writable
            console.log('Connection to the 1st DB has been established successfully.');
            activeSequelize = sequelize1; // Set the active connection
        }
    } catch (error) {
        console.error('Connection to the first database failed or it is read-only:', error);
        // Fallback to the second database
        try {
            const isReadOnly = await checkReadOnly(sequelize2);
            if (isReadOnly) {
                console.error('The second database is also in read-only mode. Unable to proceed.');
                throw new Error('Both databases are read-only.');
            }
            else {
                await sequelize2.authenticate(); // Authenticate only if writable
                console.log('Connection to the 2nd DB has been established successfully.');
                activeSequelize = sequelize2; // Set the active connection
            }
        } catch (error) {
            console.error('Connection to the second database failed or it is read-only:', error);
            console.error('Unable to start the server.');
            return;
        }
    }

    // Make sure to handle the case where no active connection was established
    if (activeSequelize) {

        // Now that activeSequelize is initialized, require the router
        const router = require("./routes/index");

        app.use("/api", (req, res, next) => router(activeSequelize)(req, res, next));
        app.listen(PORT, () => {
            console.log(`Server has started on port: ${PORT}`);
        });
    } else {
        console.error('No valid database connection established. Server cannot start.');
    }
};

start();
