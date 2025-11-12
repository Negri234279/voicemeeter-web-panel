const express = require('express')

const router = express.Router()

router.use('/voicemeeter', require('./voicemeeter.controller'))

module.exports = router
