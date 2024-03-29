const ApiError = require("../error/ApiError")
const bcrypt = require("bcrypt")
const { User, Basket } = require("../models/models")
const jwt = require("jsonwebtoken")

const generateJwt = (id, email, role, name, age, gender, city, address, country) => {
    return jwt.sign(
        { id, email, role, name, age, gender, city, address, country },
        process.env.SECRET_KEY,
        { expiresIn: "24h" }
    )
}


class UserController {
    async registration(req, res, next) {
        const { email, password, role, name, age, gender, city, address, country } = req.body

        if (Object.keys(req.body).length == 0) {
            return next(ApiError.badRequest("Where is Body???"))
        }
        if (Object.keys(req.body).length > 9) {
            return next(ApiError.badRequest("Too many params!!!"))
        }
        if (!email || !password) {
            return next(ApiError.badRequest("Enter email and passwrod!"))
        }
        const candidate = await User.findOne({ where: { email } })
        if (candidate) {
            return next(ApiError.badRequest("User already exist"))
        }
        const hashPassword = await bcrypt.hash(password, 5)
        const user = await User.create({ email, role, password: hashPassword, name, age, gender, city, address, country })
        const basket = await Basket.create({ userId: user.id })
        const token = generateJwt(user.id, user.email, user.role, user.name, user.age, user.gender, user.city, user.address, user.country)
        return res.json({ token })
    }

    async login(req, res, next) {
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
    }

    async check(req, res, next) {
        const token = generateJwt(req.user.id, req.user.email, req.user.role, req.user.name, req.user.age, req.user.gender, req.user.city, req.user.address, req.user.country)
        return res.json({token})
    }

    async updateUserAttribute(req, res, next) { 
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
    }
}

module.exports = new UserController()