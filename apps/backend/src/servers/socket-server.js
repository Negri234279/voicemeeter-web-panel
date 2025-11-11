const { Server: SocketIOServer } = require('socket.io')

const registerGateways = require('../gateways')

/**
 * Inicializa Socket.IO sobre el servidor HTTP
 * @param {import('http').Server} httpServer
 */
const initSocketServer = (httpServer) => {
    const io = new SocketIOServer(httpServer, {
        cors: { origin: '*' },
    })

    registerGateways(io)

    return io
}

module.exports = initSocketServer
