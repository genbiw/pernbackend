const express = require("express");
const createUserRouter = require("./userRouter");
const createDeviceRouter = require("./deviceRouter");
const createBrandRouter = require("./brandRouter");
const createTypeRouter = require("./typeRouter");
const createBasketRouter = require("./basketRouter");
const createRaitingRouter = require("./ratingRouter");
const createStripeRouter = require("./stripeRouter");


module.exports = function(activeSequelize) {
    const router = express.Router();

    router.use("/user", createUserRouter(activeSequelize));
    router.use("/type", createTypeRouter(activeSequelize));
    router.use("/brand", createBrandRouter(activeSequelize));
    router.use("/device", createDeviceRouter(activeSequelize));
    router.use("/basket", createBasketRouter(activeSequelize));
    router.use("/rating", createRaitingRouter(activeSequelize));
    router.use("/stripe", createStripeRouter(activeSequelize));

    return router; 
};
