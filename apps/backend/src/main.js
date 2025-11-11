require('dotenv').config({ quiet: true })

const createExpressApp = require('./servers/express-server')
const createHttpServer = require('./servers/http-server')
const initSocketServer = require('./servers/socket-server')
const VoiceMeeterService = require('./service/VoiceMeeterService')

const PORT = process.env.PORT || 3000

const vmService = VoiceMeeterService.getInstance()
vmService.init().then(() => {
    console.log('✅ VoiceMeeter conectado correctamente')
})

const app = createExpressApp()
const httpServer = createHttpServer(app)
initSocketServer(httpServer)

httpServer.listen(PORT, () => {
    console.log(`🚀 Voicemeeter backend running on: http://localhost:${PORT}`)
})
