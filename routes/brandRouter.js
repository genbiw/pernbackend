const Router = require("express")
const brandController = require("../controllers/brandController")
const checkRole = require("../middleware/checkRoleMiddleware")

function createBrandRouter(activeSequelize) {
    const router = new Router()

    router.post("/", checkRole("ADMIN"), (req, res, next) => brandController.create(req, res, next, activeSequelize))
    router.get("/", (req, res, next) => brandController.getAll(req, res, next, activeSequelize))
    router.delete("/:id", (req, res, next) => brandController.delete(req, res, next, activeSequelize))

    return router
}

module.exports = createBrandRouter