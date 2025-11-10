const { Server: SocketIOServer } = require('socket.io')

/**
 * Inicializa Socket.IO sobre el servidor HTTP
 * @param {import('http').Server} httpServer
 */
const initSocketServer = (httpServer) => {
    const io = new SocketIOServer(httpServer, {
        cors: { origin: '*' },
    })

    return io
}

module.exports = initSocketServer
