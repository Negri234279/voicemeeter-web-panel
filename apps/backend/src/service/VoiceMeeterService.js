const { Voicemeeter, StripProperties, BusProperties } = require('voicemeeter-connector')

class VoiceMeeterService {
    /** @type {VoiceMeeterService} */
    static instance = null

    /** @type {Voicemeeter} */
    vm = null

    static getInstance() {
        if (!this.instance) this.instance = new VoiceMeeterService()
        return this.instance
    }

    /**
     * Inicializa Voicemeeter si no se ha inicializado todavía
     */
    async init() {
        if (this.vm) return this.vm

        try {
            this.vm = await Voicemeeter.init()
            await this.vm.connect()

            return this.vm
        } catch (err) {
            throw new Error('Error al conectar a VoiceMeeter')
        }
    }

    /**
     * Getter para acceder a la instancia de Voicemeeter
     */
    getVm() {
        if (!this.vm) {
            throw new Error('VoiceMeeter no está inicializado. Llama a init() primero.')
        }

        return this.vm
    }

    get type() {
        return this.getVm().$type || 'voicemeeter'
    }

    async strips() {
        const { hardware, virtual } = this.#getStripsCountByTypeVersion()
        const totalStrips = hardware + virtual

        const strips = []

        for (let i = 0; i < totalStrips; i++) {
            const labelRaw = this.vm.getStripParameter(i, StripProperties.Label)
            const label = labelRaw
                .toString()
                .replace(/[\x00-\x1F\x7F]/g, '')
                .trim()

            const gainRaw = this.vm.getStripParameter(i, StripProperties.Gain)
            const gain = parseInt(gainRaw.toString())

            const outputs = this.#getOutputsLabelsByTypeVersion()
            const sends = Object.fromEntries(
                outputs.map((p) => [
                    p,
                    !!parseInt(
                        this.vm
                            .getStripParameter(i, p)
                            .toString()
                            .replace(/[\x00-\x1F\x7F]/g, '')
                            .trim(),
                    ),
                    ,
                ]),
            )

            const mute = this.#getStripParamParsedToBool(i, StripProperties.Mute)
            const mono = this.#getStripParamParsedToBool(i, StripProperties.Mono)
            const solo = this.#getStripParamParsedToBool(i, StripProperties.Solo)

            strips.push({ input: i, label, gain, sends, mono, solo, mute })
        }

        const inputs = strips.slice(0, hardware)
        const virtualsInputs = strips.slice(hardware, totalStrips)

        return { inputs, virtualsInputs }
    }

    async buses() {
        const busesLabels = this.#getOutputsLabelsByTypeVersion()

        return busesLabels.map((label, i) => {
            const sel = this.#getBusParamParsedToBool(i, 'SEL')
            const mono = this.vm.getBusParameter(i, BusProperties.Mono)
            const eq = this.#getBusParamParsedToBool(i, BusProperties.EQ)
            const mute = this.#getBusParamParsedToBool(i, BusProperties.Mute)

            const gainRaw = this.vm.getBusParameter(i, BusProperties.Gain)
            const gain = parseInt(gainRaw.toString())

            return { input: i, label, sel, mono, eq, mute, gain }
        })
    }

    async vban() {
        const vm = this.getVm()
        const enabled = !!vm.getParameter('vban.Enable')

        return { enabled }
    }

    async macroButtons() {
        const vm = this.getVm()
        const buttons = []

        const totalButtons = 16 // Voicemeeter y Banana, Potato pueden ser 16 o más

        for (let i = 0; i < totalButtons; i++) {
            const state = parseInt(vm.getParameter(`MacroButton[${i}]`).toString())
            buttons.push({ index: i, pressed: !!state })
        }

        return buttons
    }

    #getStripsCountByTypeVersion() {
        const types = {
            voicemeeter: { hardware: 2, virtual: 3 },
            voicemeeterBanana: { hardware: 3, virtual: 2 },
            voicemeeterPotato: { hardware: 5, virtual: 3 },
        }

        return types[this.type]
    }

    #getOutputsLabelsByTypeVersion() {
        const types = {
            voicemeeter: ['A1', 'A2', 'A3', 'B1', 'B2'],
            voicemeeterBanana: ['A1', 'A2', 'A3', 'B1', 'B2'],
            voicemeeterPotato: ['A1', 'A2', 'A3', 'A4', 'A5', 'B1', 'B2', 'B3'],
        }

        return types[this.type]
    }

    /**
     * @param {number} index
     * @param {typeof StripProperties} property
     * @returns {boolean}
     */
    #getStripParamParsedToBool(index, property) {
        const rawValue = this.vm.getStripParameter(index, property)
        return !!parseInt(rawValue.toString())
    }

    /**
     * @param {number} index
     * @param {typeof BusProperties} property
     * @returns {boolean}
     */
    #getBusParamParsedToBool(index, property) {
        const rawValue = this.vm.getBusParameter(index, property)
        return !!parseInt(rawValue.toString())
    }
}

module.exports = VoiceMeeterService
