const voicemeeterGateway = require('./voicemeeter.gateway')

/**
 * Registra los gateways de Socket.io
 * @param {import('socket.io').Server} io
 */
const registerGateways = (io) => {
    voicemeeterGateway(io.of('/voicemeeter'))
}

module.exports = registerGateways
