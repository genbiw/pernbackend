const { defineModels } = require("../models/models")
const ApiError = require("../error/ApiError")

class BrandController {
    async create(req, res, next, activeSequelize) {

        const models = defineModels(activeSequelize)
        const Brand = models.Brand

        try {
            const { name } = req.body
            const brand = await Brand.create({ name })
            return res.json(brand)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async getAll(req, res, next, activeSequelize) {

        const models = defineModels(activeSequelize)
        const Brand = models.Brand

        try {
            const brands = await Brand.findAll()
            return res.json(brands)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async delete(req, res, next, activeSequelize) {

        const models = defineModels(activeSequelize)
        const Brand = models.Brand

        try {
            const { id } = req.params
            const deletedRowCount = await Brand.destroy({
                where: {
                    id: id
                }
            });

            if (deletedRowCount === 0) {
                return res.status(404).json({ message: "Brand not found" });
            }

            return res.status(200).json({ message: "Brand deleted successfully" });
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
}

module.exports = new BrandController() 

