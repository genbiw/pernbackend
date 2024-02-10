const {Type} = require("../models/models")
const ApiError = require("../error/ApiError")
  
class TypeController {
    async create(req, res){
        const {name} = req.body
        const type = await Type.create({name})
        return res.json(type)
    }

    async getAll(req, res){
        const types = await Type.findAll()
        return res.json(types)
    }

    async delete(req, res){
        const {id} = req.params
        const deletedRowCount = await Type.destroy({
            where: {id}
        })
        if (deletedRowCount === 0){
            return res.status(404).json({message: `Type not found`})
        }
        return res.status(200).json({message: `Type was deleted successfully`})
    }
}

module.exports = new TypeController() 