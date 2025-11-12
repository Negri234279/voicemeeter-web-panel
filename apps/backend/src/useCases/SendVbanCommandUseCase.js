class SendVbanCommandUseCase {
    /**
     * @param {import("../service/VbanService")} vbanService
     */
    constructor(vbanService) {
        this.vbanService = vbanService
    }

    /**
     * @param {string} command 
     */
    async execute(command) {
        await this.vbanService.sendCommand(command)
    }
}

module.exports = SendVbanCommandUseCase
