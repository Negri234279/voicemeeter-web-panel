const http = require('node:http')

/**
 * Crea un servidor HTTP nativo.
 * @param {import('express').Express} app - Instancia de Express.
 * @returns {http.Server}
 */
const createHttpServer = (app) => {
    const server = http.createServer(app)
    return server
}

module.exports = createHttpServer
