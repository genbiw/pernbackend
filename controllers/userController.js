const ApiError = require("../error/ApiError")
const bcrypt = require("bcrypt")
const { User, Basket } = require("../models/models")
const jwt = require("jsonwebtoken")

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


class UserController {
    async registration(req, res, next) {

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
            const user = await User.create({ email, phoneNumber, role, password: hashPassword, userName, age, gender, city, address, country })
            const basket = await Basket.create({ userId: user.id })
            const token = generateJwt(user.id, user.email, user.phoneNumber, user.role, user.userName, user.age, user.gender, user.city, user.address, user.country)
            return res.json({ token })
        } catch (e) {
            // Handle unexpected errors
            return next(ApiError.internal("Something went wrong"));
        }

    }

    async login(req, res, next) {
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
            const token = generateJwt(user.id, user.email, user.role, user.name, user.age, user.gender, user.city, user.address, user.country)
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

    async updateUserAttribute(req, res, next) {
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
            return next(ApiError.internal("Something went wrong"));
        }
    }
}

module.exports = new UserController()