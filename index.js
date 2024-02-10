const express = require("express")
require("dotenv").config()
const sequelize = require("./db")
const models = require("./models/models")
const cors = require("cors")
const router = require("./routes/index")
const errorHandler = require("./middleware/ErrorHandlingMiddleware")
const fileupload = require("express-fileupload")
const path = require("path")

const PORT = process.env.PORT || 5000

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static(path.resolve(__dirname, "static")))
app.use(fileupload({}))
app.use("/api", router)
app.use(errorHandler) //Error midleware should be last in chain

const start = async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync()
        app.listen(PORT, () => {console.log("Server has started on port:", PORT)})
    }catch(e){
        console.log(`Server start error ${e}`)
    }
}

start() 