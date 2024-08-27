const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require("bcrypt")

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

const sequelize1 = new Sequelize('demoback', 'demoback_user', 'eiY7xYmHqesWELChJcpgKwpi', {
    host: 'pdb-iop1-dkdb-1.io-ancotel.local',
    dialect: 'postgres',
    logging: console.log, // Enable logging
});

const sequelize2 = new Sequelize('demoback', 'demoback_user', 'eiY7xYmHqesWELChJcpgKwpi', {
    host: 'pdb-iop1-dkdb-2.io-ancotel.local',
    dialect: 'postgres',
    logging: console.log, // Enable logging
});

const id = 123
const email = 'vladimir71.ni@infobip.com'
const phoneNumber = 77476264171
const password = 'hashed123password'
const role = "USER"
const userName = "Bob"
const age = 34
const gender = "male"
const city = "City123"
const address = "address123"
const country = "conuntry123"

const User1 = sequelize1.define("user", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    email: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.STRING,
    userName: DataTypes.STRING,
    age: DataTypes.INTEGER,
    gender: DataTypes.STRING,
    city: DataTypes.STRING,
    address: DataTypes.STRING,
    country: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
}, {
    tableName: 'users', // Explicitly specify the table name
    timestamps: false,
});

const User2 = sequelize2.define("user", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    email: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.STRING,
    userName: DataTypes.STRING,
    age: DataTypes.INTEGER,
    gender: DataTypes.STRING,
    city: DataTypes.STRING,
    address: DataTypes.STRING,
    country: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
}, {
    tableName: 'users', // Explicitly specify the table name
    timestamps: false,
});





(async () => {

    try {
        // Check if the first database is writable
        const isReadOnly = await checkReadOnly(sequelize1);
        if (isReadOnly) {
            console.log('First database is in read-only mode. Attempting connection to the second database.');
            throw new Error('First database is read-only or failed.');
        } else {
            await sequelize1.authenticate(); // Authenticate only if writable
            // await User1.sync(); // Ensure the table exists
            console.log('Connection to the 1st DB has been established successfully.');

            const hashPassword = await bcrypt.hash(password, 5)

            // Try inserting a record
            const user = await User1.create({
                email: email,
                phoneNumber: phoneNumber,
                password: hashPassword,
                role: role,
                userName: userName,
                age: age,
                gender: gender,
                city: city,
                address: address,
                country: country,
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            console.log('User1 created:', user.toJSON());

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
                // await User2.sync(); // Ensure the table exists
                console.log('Connection to the 2nd DB has been established successfully.');

                const hashPassword = await bcrypt.hash(password, 5)

                // Try inserting a record
                const user = await User2.create({
                    email: email,
                    phoneNumber: phoneNumber,
                    password: hashPassword,
                    role: role,
                    userName: userName,
                    age: age,
                    gender: gender,
                    city: city,
                    address: address,
                    country: country,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                });

                console.log('User2 created:', user.toJSON());

                activeSequelize = sequelize2; // Set the active connection
            }
        } catch (error) {
            console.error('Connection to the second database failed or it is read-only:', error);
            console.error('Unable to start the server.');
            return;
        }finally {
            await sequelize2.close();
        }
    }finally {
        await sequelize1.close();
    }

})();
