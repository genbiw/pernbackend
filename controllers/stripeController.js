const { defineModels } = require("../models/models")
const stripe = require('stripe')('sk_test_51Nx8sFICc2myeD3vE6BgFB5AE2A84rYNWZqbB9d5omrkkDPtz7ibWLg07tD72v3IPNapLErhgQ7CyKwQTMcXrYEp00FpNjyjaw')
const ApiError = require("../error/ApiError");

class StripeController {
    async CheckOut(req, res, next, activeSequelize) {

        const models = defineModels(activeSequelize)
        const Basket = models.Basket
        const BasketDevice = models.BasketDevice
        const Device = models.Device

        try {
            const { userId } = req.params
            const basket = await Basket.findOne({ where: { userId } })
            const basketDevices = await BasketDevice.findAll({ where: { basketId: basket.id } })
            const deviceIds = basketDevices.map(device => device.deviceId)

            const devicesData = await Promise.all(deviceIds.map(async deviceId => {
                return await Device.findOne({ where: { id: deviceId } })
            }))

            const line_items = devicesData.map(device => {
                return {
                    price_data: {
                        currency: 'eur',
                        product_data: {
                            name: device.name,
                        },
                        unit_amount: device.price * 100,
                    },
                    quantity: 1,
                }
            })

            const session = await stripe.checkout.sessions.create({
                line_items: line_items,
                mode: 'payment',
                success_url: 'https://infobip.com',
                cancel_url: 'https://infobip.com',
            })
            console.log(session)
            return res.status(200).json(session.url);
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
}

module.exports = new StripeController()