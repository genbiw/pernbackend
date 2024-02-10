const Router = require("express")
const router = new Router()
const basketController = require("../controllers/basketController")

router.post("/", basketController.addDevice) 
router.get("/:userId", basketController.getAll)
router.delete("/user/:userId/device/:deviceId/update", basketController.updateDevice)
router.delete("/user/:userId/device/:deviceId/delete", basketController.deleteDevice)
router.delete("/user/:userId", basketController.deleteAllDevices)
module.exports = router 