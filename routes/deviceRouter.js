const Router = require("express")
const deviceController = require("../controllers/deviceController")

function createDeviceRouter(activeSequelize) {
    const router = new Router()

    router.post("/", (req, res, next) => deviceController.create(req, res, next, activeSequelize))
    router.get("/", (req, res, next) => deviceController.getAll(req, res, next, activeSequelize))
    router.get("/:id", (req, res, next) => deviceController.getOne(req, res, next, activeSequelize))
    router.delete("/:id", (req, res, next) => deviceController.delete(req, res, next, activeSequelize))

    return router
}

module.exports = createDeviceRouter