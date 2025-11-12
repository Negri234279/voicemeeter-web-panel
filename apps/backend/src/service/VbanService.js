const dgram = require('dgram')

class VbanService {
    static instance = null

    #socket
    #host = '127.0.0.1'
    #port = 6980
    #streamName = 'Command1'
    #frameCounter = 0

    constructor() {
        if (VbanService.instance) return VbanService.instance

        this.#socket = dgram.createSocket('udp4')

        this.#socket.on('error', (err) => {
            console.error('❌ VBAN socket error:', err)
            this.#socket.close()
        })

        VbanService.instance = this
    }

    static getInstance() {
        return this.instance ?? new VbanService()
    }

    /**
     * Envía un comando VBAN-TEXT, p.ej.:
     *   Strip[0].Mute = 1
     * @param {string} command
     */
    async sendCommand(command) {
        if (!command || typeof command !== 'string') {
            throw new Error(`Comando VBAN inválido: ${command}`)
        }

        const header = Buffer.alloc(28, 0)
        header.write('VBAN', 0, 4, 'ascii') // Magic
        header.writeUInt8(0x54, 4) // 0x54 = 'T' (VBAN-TEXT)
        header.writeUInt8(0, 5) // format = ASCII
        header.writeUInt8(0, 6) // nb sample = 0
        header.writeUInt8(0, 7) // reserved
        header.write(this.#streamName, 8, 16, 'ascii')
        header.writeUInt32LE(this.#frameCounter++, 24) // frame counter

        const body = Buffer.from(command + '\0', 'ascii')
        const packet = Buffer.concat([header, body])

        return new Promise((resolve, reject) => {
            this.#socket.send(packet, this.#port, this.#host, (err) => {
                if (err) {
                    reject(new Error(`Error al enviar comando VBAN ${command}: ${err.message}`))
                }

                resolve()
            })
        })
    }

    close() {
        this.#socket.close()
        console.log('🔻 VBAN socket cerrado')
    }
}

module.exports = VbanService
