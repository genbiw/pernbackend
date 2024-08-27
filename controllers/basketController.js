const ApiError = require("../error/ApiError")
const { defineModels  } = require("../models/models") 

class BasketController {

    async getAll(req, res, next, activeSequelize) {

        const models = defineModels(activeSequelize)
        const Basket = models.Basket
        const BasketDevice = models.BasketDevice 

        try {
            const { userId } = req.params
            const basket = await Basket.findOne({ where: { userId } })
            const basketDevices = await BasketDevice.findAll({ where: { basketId: basket.id } })
            return res.json(basketDevices)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async addDevice(req, res, next, activeSequelize) { 

        const models = defineModels(activeSequelize)
        const Basket = models.Basket
        const BasketDevice = models.BasketDevice 

        try {
            const { userId, deviceId, reqQuantity = 1 } = req.body
            const basket = await Basket.findOne({ where: { userId } })
            if (basket) {
                const existingBasketDevice = await BasketDevice.findOne({ where: { basketId: basket.id, deviceId } })

                if (existingBasketDevice) {
                    existingBasketDevice.quantity += reqQuantity
                    await existingBasketDevice.save()
                    return res.json(existingBasketDevice)
                } else {
                    const basketDevice = await BasketDevice.create({ basketId: basket.id, deviceId, quantity: reqQuantity })
                    return res.json(basketDevice)
                }
            }
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
 
    async updateDevice(req, res, next, activeSequelize) {

        const models = defineModels(activeSequelize)
        const Basket = models.Basket
        const BasketDevice = models.BasketDevice 

        try {
            const { userId, deviceId } = req.params
            const { reqQuantity } = req.query
            if (reqQuantity <= 0){
                return res.status(404).json({ message: "You can't add, quantity <= 0" });
            }
            const basket = await Basket.findOne({ where: { userId } });
            if (!basket) {
                return res.status(404).json({ message: "Basket not found" });
            }

            const basketDevice = await BasketDevice.findOne({ where: { basketId: basket.id, deviceId } });
            if (!basketDevice) {
                return res.status(404).json({ message: "Device not found in the basket" });
            }
            
            basketDevice.quantity = reqQuantity
            await basketDevice.save();
            return res.json(basketDevice);

        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async deleteDevice(req, res, next, activeSequelize) {

        const models = defineModels(activeSequelize)
        const Basket = models.Basket
        const BasketDevice = models.BasketDevice 

        try {
            const { userId, deviceId } = req.params
            const basket = await Basket.findOne({ where: { userId } });
            if (!basket) {
                return res.status(404).json({ message: "Basket not found" });
            }

            const basketDevice = await BasketDevice.findOne({ where: { basketId: basket.id, deviceId } });
            if (!basketDevice) {
                return res.status(404).json({ message: "Device not found in the basket" });
            }

            await basketDevice.destroy();
            return res.json({ message: `Device was removed from the basket` })
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async deleteAllDevices(req, res, next, activeSequelize) {

        const models = defineModels(activeSequelize)
        const Basket = models.Basket
        const BasketDevice = models.BasketDevice 

        try {
            const { userId } = req.params
            const basket = await Basket.findOne({ where: { userId } })
            if (!basket) {
                return res.status(404).json({ message: `Baskey not found` })
            }
            await BasketDevice.destroy({ where: { basketId: basket.id } })
            return res.json({ message: `Devices were removed from the basket` })
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
}

module.exports = new BasketController() 