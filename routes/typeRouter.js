const Router = require("express")
const typeController = require("../controllers/typeController")
const checkRole = require("../middleware/checkRoleMiddleware")

function createTypeRouter(activeSequelize) {
    const router = new Router()

    router.post("/", checkRole("ADMIN"), (req, res, next) => typeController.create(req, res, next, activeSequelize))
    router.get("/", (req, res, next) => typeController.getAll(req, res, next, activeSequelize))
    router.delete("/:id", (req, res, next) => typeController.delete(req, res, next, activeSequelize))

    return router
}



module.exports = createTypeRouter 