const Router = require("express");
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

function createUserRouter(activeSequelize) {

    const router = new Router();

    router.post("/registration", (req, res, next) => userController.registration(req, res, next, activeSequelize));
    router.post("/login", (req, res, next) => userController.login(req, res, next, activeSequelize));
    router.get("/auth", authMiddleware, (req, res, next) => userController.check(req, res, next));
    router.post("/updateuser", authMiddleware, (req, res, next) => userController.updateUserAttribute(req, res, next, activeSequelize));
    router.get("/getinfobiplctoken", authMiddleware, (req, res, next) => userController.infobipAuthLC(req, res, next));

    return router;
}

module.exports = createUserRouter;
