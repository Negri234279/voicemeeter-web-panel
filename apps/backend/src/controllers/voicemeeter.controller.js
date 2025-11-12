const VbanService = require('../service/VbanService')
const VoiceMeeterService = require('../service/VoiceMeeterService')
const GetVoicemeeterStatusUseCase = require('../useCases/GetVoicemeeterStatusUseCase')
const SendVbanCommandUseCase = require('../useCases/SendVbanCommandUseCase')

const router = require('express').Router()

const vbanService = VbanService.getInstance()
const voiceMeeterService = VoiceMeeterService.getInstance()

const getVoicemeeterStatusUseCase = new GetVoicemeeterStatusUseCase(voiceMeeterService)
const sendVbanCommandUseCase = new SendVbanCommandUseCase(vbanService)

router.get('/status', async (_req, res) => {
    try {
        const status = await getVoicemeeterStatusUseCase.execute()

        res.status(200).json(status)
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el estado de Voicemeeter' })
    }
})

router.post('/command', async (req, res) => {
    try {
        const { command } = req.body

        await sendVbanCommandUseCase.execute(command)

        res.status(201).json({ success: true })
    } catch (error) {
        res.status(500).json({ error: 'Error al enviar el comando VBAN' })
    }
})

module.exports = router
