const Router = require("express")
const router = new Router()
const userController = require("../controllers/userController")
const authMiddleware = require("../middleware/authMiddleware")

router.post("/registration", userController.registration)
router.post("/login", userController.login)
router.get("/auth", authMiddleware, userController.check)
router.get("/getuser", authMiddleware, userController.getUser)
router.post("/updateuser", userController.updateUserAttribute)

module.exports = router   