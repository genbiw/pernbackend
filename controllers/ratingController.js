const ApiError = require("../error/ApiError");
const { defineModels } = require("../models/models");

class RatingController {
    async addRate(req, res, next, activeSequelize) {

        const models = defineModels(activeSequelize)
        const Rating = models.Rating

        try {
            const { userId, deviceId, rate } = req.body
            const rating = await Rating.create({ rate, userId, deviceId })
            return res.json(rating)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async getRating(req, res, next, activeSequelize) {

        const models = defineModels(activeSequelize)
        const Rating = models.Rating

        try {
            const { deviceId } = req.params
            const rates = await Rating.findAll({ where: { deviceId } })
            const ratingValues = rates.map(data => data.rate)
            const sumOfRates = ratingValues.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
            const NumberOfRates = ratingValues.length
            const rating = sumOfRates / NumberOfRates
            const ratingRounded = Number(rating.toFixed(2));
            return res.json(ratingRounded)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
}

module.exports = new RatingController()