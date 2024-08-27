const Router = require("express")
const router = new Router
const stripeController = require("../controllers/stripeController")

router.post("/create-checkout-session/:userId", (req, res, next) => stripeController.CheckOut(req, res, next, activeSequelize)) 

module.exports = router