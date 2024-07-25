const Router = require("express")
const ratingController = require("../controllers/ratingController")
const router = new Router()

router.post("/", ratingController.addRate)
router.get("/:deviceId", ratingController.getRating)

module.exports = router 