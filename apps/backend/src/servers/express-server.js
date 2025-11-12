const express = require('express')
const cors = require('cors')

const routes = require('../controllers/index')

const createExpressApp = () => {
    const app = express()

    app.use(express.json())
    app.use(cors())

    app.use('/api', routes)

    return app
}

module.exports = createExpressApp
