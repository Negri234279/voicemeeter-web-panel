const VoiceMeeterService = require('../service/VoiceMeeterService')
const GetVoicemeeterStatusUseCase = require('../useCases/GetVoicemeeterStatusUseCase')

const vmService = VoiceMeeterService.getInstance()
const getStatusUseCase = new GetVoicemeeterStatusUseCase(vmService)

/**
 * Voicemeeter Gateway for Socket.io
 * @param {import('socket.io').Namespace} nsp
 */
const voicemeeterGateway = (nsp) => {
    nsp.on('connection', async (socket) => {
        console.log(`🟢 Cliente conectado al namespace /voicemeeter: ${socket.id}`)

        const status = await getStatusUseCase.execute()
        socket.emit('status', status)

        let debounceTimer = null

        vmService.vm.attachChangeEvent(async () => {
            if (debounceTimer) clearTimeout(debounceTimer)

            debounceTimer = setTimeout(async () => {
                console.log('🔄 Cambio detectado en Voicemeeter, enviando estado actualizado')

                try {
                    const status = await getStatusUseCase.execute()
                    socket.emit('status', status)
                } catch (err) {
                    console.error('Error al obtener el estado actualizado de Voicemeeter:', err)
                }
            }, 200)
        })

        socket.on('get-status', async () => {
            const status = await getStatusUseCase.execute()
            socket.emit('status', status)
        })

        socket.on('disconnect', () => {
            console.log(`🔴 Cliente desconectado de /voicemeeter: ${socket.id}`)
        })
    })
}

module.exports = voicemeeterGateway
