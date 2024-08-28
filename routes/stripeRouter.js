const Router = require("express")
const stripeController = require("../controllers/stripeController")

function createStripeRouter(activeSequelize){
    const router = new Router

    router.post("/create-checkout-session/:userId", (req, res, next) => stripeController.CheckOut(req, res, next, activeSequelize)) 

    return router
}

module.exports = createStripeRouter