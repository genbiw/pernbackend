const express = require("express");
const createUserRouter = require("./userRouter");
const deviceRouter = require("./deviceRouter");
const brandRouter = require("./brandRouter");
const typeRouter = require("./typeRouter");
const basketRouter = require("./basketRouter");
const ratingRouter = require("./ratingRouter");
const stripeRouter = require("./stripeRouter");

module.exports = function(activeSequelize) {
    const router = express.Router();

    router.use("/user", createUserRouter(activeSequelize));
    router.use("/type", typeRouter);
    router.use("/brand", brandRouter);
    router.use("/device", deviceRouter);
    router.use("/basket", basketRouter);
    router.use("/rating", ratingRouter);
    router.use("/stripe", stripeRouter);

    return router;
};
