const {Brand} = require("../models/models")
const ApiError = require("../error/ApiError")

class BrandController {
    async create(req, res) {
        const { name } = req.body
        const brand = await Brand.create({ name })
        return res.json(brand)
    }

    async getAll(req, res) {
        const brands = await Brand.findAll()
        return res.json(brands)
    }

    async delete(req, res){
        const {id} = req.params
        const deletedRowCount = await Brand.destroy({
            where: {
                id: id
            }
        });

        if (deletedRowCount === 0) {
            return res.status(404).json({ message: "Brand not found" });
        }

        return res.status(200).json({ message: "Brand deleted successfully" });
    }
}

module.exports = new BrandController()

