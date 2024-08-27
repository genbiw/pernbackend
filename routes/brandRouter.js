const Router = require("express")
const router = new Router()
const brandController = require("../controllers/brandController")
const checkRole = require("../middleware/checkRoleMiddleware")

router.post("/", checkRole("ADMIN"), (req, res, next) => brandController.create(req, res, next, activeSequelize))
router.get("/", (req, res, next) => brandController.getAll(req, res, next, activeSequelize))
router.delete("/:id", (req, res, next) => brandController.delete(req, res, next, activeSequelize)) 

module.exports = router