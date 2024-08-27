const Router = require("express")
const router = new Router()
const deviceController = require("../controllers/deviceController")

router.post("/", (req, res, next) => deviceController.create(req, res, next, activeSequelize))
router.get("/", (req, res, next) => deviceController.getAll(req, res, next, activeSequelize))
router.get("/:id", (req, res, next) => deviceController.getOne(req, res, next, activeSequelize))
router.delete("/:id", (req, res, next) => deviceController.delete(req, res, next, activeSequelize)) 


module.exports = router