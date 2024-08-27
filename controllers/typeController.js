const { defineModels } = require("../models/models")
const ApiError = require("../error/ApiError")
 
class TypeController {
    async create(req, res, next, activeSequelize) {

        const models = defineModels(activeSequelize)
        const Type = models.Type

        try {
            const { name } = req.body
            const type = await Type.create({ name })
            return res.json(type)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }

    }

    async getAll(req, res, next, activeSequelize) {

        const models = defineModels(activeSequelize)
        const Type = models.Type

        try {
            const types = await Type.findAll()
            return res.json(types)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }

    }

    async delete(req, res, next, activeSequelize) {

        const models = defineModels(activeSequelize)
        const Type = models.Type

        try {
            const { id } = req.params
            const deletedRowCount = await Type.destroy({
                where: { id }
            })
            if (deletedRowCount === 0) {
                return res.status(404).json({ message: `Type not found` })
            }
            return res.status(200).json({ message: `Type was deleted successfully` })
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
}

module.exports = new TypeController()