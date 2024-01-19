const Router = require("express")
const router = new Router
const stripeController = require("../controllers/stripeController")

router.post("/create-checkout-session/:userId", stripeController.CheckOut)

module.exports = router