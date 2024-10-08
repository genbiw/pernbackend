const Router = require("express")
const basketController = require("../controllers/basketController")

function createBasketRouter(activeSequelize) {

    const router = new Router()

    router.post("/", (req, res, next) => basketController.addDevice(req, res, next, activeSequelize))
    router.get("/:userId", (req, res, next) => basketController.getAll(req, res, next, activeSequelize))
    router.delete("/user/:userId/device/:deviceId/update", (req, res, next) => basketController.updateDevice(req, res, next, activeSequelize))
    router.delete("/user/:userId/device/:deviceId/delete", (req, res, next) => basketController.deleteDevice(req, res, next, activeSequelize))
    router.delete("/user/:userId", (req, res, next) => basketController.deleteAllDevices(req, res, next, activeSequelize))

    return router

}

module.exports = createBasketRouter