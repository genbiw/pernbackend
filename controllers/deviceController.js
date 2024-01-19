const uuid = require("uuid")
const path = require("path")
const { Device, DeviceInfo } = require("../models/models")
const ApiError = require("../error/ApiError")

class DeviceController {
    async create(req, res, next) {
        try {
            let { name, price, brandId, typeId, info } = req.body
            const { img } = req.files
            let fileName = uuid.v4() + ".jpg"
            img.mv(path.resolve(__dirname, "..", "static", fileName))

            const device = await Device.create({ name, price, brandId, typeId, img: fileName })

            if (info) {
                info = JSON.parse(info)
                info.forEach(i => 
                    DeviceInfo.create({
                        title: i.title,
                        description: i.description,
                        deviceId: device.id
                    })
                )
            }


            return res.json(device)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async getAll(req, res) {
        let {brandId, typeId, limit, page} = req.query
        page = page || 1
        limit = limit || 9
        let offset = page * limit - limit

        let devices
        if(!brandId && !typeId){
            devices = await Device.findAndCountAll({limit, offset})
        }
        if(brandId && !typeId){
            devices = await Device.findAndCountAll({where:{brandId}, limit, offset})
        }
        if(!brandId && typeId){
            devices = await Device.findAndCountAll({where:{typeId}, limit, offset})
        }
        if(brandId && typeId){
            devices = await Device.findAndCountAll({where:{brandId, typeId}, limit, offset})
        }
        return res.json(devices)
    }

    async getOne(req, res, next) {
        const {id} = req.params
        const device = await Device.findOne(
            {
                where: {id},
                include: [{model: DeviceInfo, as: "info"}]
            }
        )
        if(device === null){
            next(ApiError.badRequest("Device not found")) 
            return
        }
        return res.json(device)
    }

    async delete(req, res) {
        const {id} = req.params
        const deletedRowCount = await Device.destroy({
            where: {id}
        })
        if(deletedRowCount === 0){
            return res.status(404).json({message: `Device not found`})
        }
        return res.status(200).json({message: `Device was deleted`})
    }
}

module.exports = new DeviceController() 