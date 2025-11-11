class GetVoicemeeterStatusUseCase {
    /**
     * @param {import("../service/VoiceMeeterService")} vmService
     */
    constructor(vmService) {
        this.vmService = vmService
    }

    async execute() {
        const type = this.vmService.type

        const promises = [this.vmService.vban(), this.vmService.strips(), this.vmService.buses()]

        const [vban, inputs, buses] = await Promise.all(promises)

        return { type, vban, ...inputs, buses }
    }
}

module.exports = GetVoicemeeterStatusUseCase
