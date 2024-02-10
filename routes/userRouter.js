const Router = require("express")
const router = new Router()
const userController = require("../controllers/userController")
const authMiddleware = require("../middleware/authMiddleware")
const tokenMiddleware = require("../middleware/checkTokenMiddleware")

router.post("/registration", userController.registration)
router.post("/login", userController.login)
router.get("/auth", authMiddleware, userController.check)
router.post("/updateuser", tokenMiddleware, userController.updateUserAttribute)

module.exports = router