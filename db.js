const { Sequelize } = require("sequelize");

const sequelize1 = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        dialect: "postgres",
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
    }
);

const sequelize2 = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        dialect: "postgres",
        host: process.env.DB_HOST2, // Add a new environment variable for the second database host
        port: process.env.DB_PORT,
    }
);

module.exports = { sequelize1, sequelize2 };
