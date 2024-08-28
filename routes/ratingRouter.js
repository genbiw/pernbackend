const Router = require("express")
const ratingController = require("../controllers/ratingController")

function createRaitingRouter(activeSequelize){
    const router = new Router()

    router.post("/", (req, res, next) => ratingController.addRate(req, res, next, activeSequelize))
    router.get("/:deviceId", (req, res, next) => ratingController.getRating(req, res, next, activeSequelize)) 

    return router
}

module.exports = createRaitingRouter 