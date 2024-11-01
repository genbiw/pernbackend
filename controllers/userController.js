const ApiError = require("../error/ApiError")
const bcrypt = require("bcrypt")
const { defineModels } = require("../models/models")
const jwt = require("jsonwebtoken")
const crypto = require("crypto")

const generateJwt = (id, email, phoneNumber, role, userName, age, gender, city, address, country) => {

    return jwt.sign(
        {
            id,
            email,
            phoneNumber,
            role,
            userName: userName !== null ? userName : '',
            age: age !== null ? age : '',
            gender: gender !== null ? gender : '',
            city: city !== null ? city : '',
            address: address !== null ? address : '',
            country: country !== null ? country : ''
        },
        process.env.SECRET_KEY,
        { expiresIn: "24h" }
    )
}

const generateInfobipJwtLC = (email) => {
    const currentTimeInSeconds = Math.floor(Date.now() / 1000);
    const uniqueJti = crypto.randomUUID().slice(0, 50); // Ensures max 50 characters for uniqueness
    const uniqueSid = crypto.randomUUID().slice(0, 50); // Unique session ID, max 50 chars

    // Decode the secret key from Base64
    const decodedSecretKey = Buffer.from(process.env.INFOBIP_LC_SECRET_KEY, 'base64');

    return jwt.sign(
        {
            jti: uniqueJti,
            sub: email,
            stp: "email",
            iss: "e1bc950a-c62f-4b7e-b393-4d3a36d67c22",
            iat: currentTimeInSeconds,
            ski: "36cd31fe-085c-4dee-9255-0360073baac7",
            sid: uniqueSid
        },
        decodedSecretKey,
        { algorithm: 'HS256' }
    )
}


class UserController {
    async registration(req, res, next, activeSequelize) {

        const models = defineModels(activeSequelize)
        const User = models.User
        const Basket = models.Basket

        try {
            const { email, phoneNumber, password, role, userName, age, gender, city, address, country } = req.body

            if (Object.keys(req.body).length == 0) {
                return next(ApiError.badRequest("Where is Body???"))
            }
            if (Object.keys(req.body).length > 10) {
                return next(ApiError.badRequest("Too many params!!!"))
            }
            if (!email || !password) {
                return next(ApiError.badRequest("Enter email and passwrod!"))
            }
            const candidate = await User.findOne({ where: { email } })
            if (candidate) {
                return next(ApiError.badRequest("User already exist"))
            }
            const phoneNumberToString = phoneNumber.toString()
            const candidatePhone = await User.findOne({ where: { phoneNumber: phoneNumberToString } })
            if (candidatePhone) {
                return next(ApiError.badRequest("User already exist"))
            }
            const hashPassword = await bcrypt.hash(password, 5)
            const user = await User.create({ email, phoneNumber, role, password: hashPassword, userName, age, gender, city, address, country, createdAt: new Date(), updatedAt: new Date(), })
            const basket = await Basket.create({ userId: user.id })
            const token = generateJwt(user.id, user.email, user.phoneNumber, user.role, user.userName, user.age, user.gender, user.city, user.address, user.country)
            return res.json({ token })
        } catch (e) {
            // Handle unexpected errors
            return next(ApiError.internal(e));
        }

    }

    async login(req, res, next, activeSequelize) {

        const models = defineModels(activeSequelize)
        const User = models.User

        try {
            const { email, password } = req.body

            if (Object.keys(req.body).length == 0) {
                return next(ApiError.badRequest("Where is Body???"))
            }
            if (Object.keys(req.body).length > 2) {
                return next(ApiError.badRequest("Too many params!!!"))
            }
            if (!email || !password) {
                return next(ApiError.badRequest("Enter email and passwrod!"))
            }

            const user = await User.findOne({ where: { email } })
            if (!user) {
                return next(ApiError.badRequest("User doesn't exist"))
            }
            let comparePassword = bcrypt.compareSync(password, user.password)
            if (!comparePassword) {
                return next(ApiError.badRequest("Wrong login or password"))
            }
            const token = generateJwt(user.id, user.email, user.phoneNumber, user.role, user.userName, user.age, user.gender, user.city, user.address, user.country)
            return res.json({ token })
        } catch (e) {
            // Handle unexpected errors
            return next(ApiError.internal("Something went wrong"));
        }
    }

    async check(req, res, next) {
        const token = generateJwt(req.user.id, req.user.email, req.user.phoneNumber, req.user.role, req.user.userName, req.user.age, req.user.gender, req.user.city, req.user.address, req.user.country)
        return res.json({ token })
    }

    async updateUserAttribute(req, res, next, activeSequelize) {

        const models = defineModels(activeSequelize)
        const User = models.User

        try {
            const { email, attributename, attributevalue } = req.body
            if (Object.keys(req.body).length == 0) {
                return next(ApiError.badRequest("Where is Body???"))
            }
            if (Object.keys(req.body).length > 4) {
                return next(ApiError.badRequest("Too many params!!!"))
            }
            if (!email) {
                return next(ApiError.badRequest("Enter email!"))
            }

            const user = await User.findOne({ where: { email } })
            if (!user) {
                return next(ApiError.badRequest("User doesn't exist"))
            }
            if (attributename in user) {
                const updateObject = {};
                updateObject[attributename] = attributevalue;
                const updatedUser = await User.update(
                    updateObject,
                    { where: { id: user.id } }
                )
                const newuser = await User.findOne({ where: { email } })
                return res.json(newuser)
            }
        } catch (e) {
            // Handle unexpected errors
            return next(ApiError.internal(e));
        }
    }

    async infobipAuthLC(req, res, next) {
        try{
            const infobipLiveChatToken = generateInfobipJwtLC(req.query.email)
            return res.json({ token: infobipLiveChatToken })
        }catch(e){
            return next(ApiError.internal(e));
        }
    }
}

module.exports = new UserController()