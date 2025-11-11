import { useEffect, useState } from 'preact/hooks'
import io from 'socket.io-client'

import type { Status, typeVM } from '../types/status'
import InputsPanel from "./InputsPanel"
import VirtualInputsPanel from "./VirtualInputsPanel"
import BusesPanel from "./BusesPanel"


export default function VoicemeeterDashboard() {
    const [status, setStatus] = useState<Status | null>(null)

    useEffect(() => {
        const socket = io('http://192.168.1.33:3000/voicemeeter')

        socket.on('connect', () => console.log('🟢 Conectado a Voicemeeter'))
        socket.on('status', (status: Status) => {
            console.log(status)
            setStatus(status)
        })

        return () => socket.disconnect()
    }, [])

    if (!status) {
        return (
            <div class="flex justify-center items-center h-full text-slate-400">
                Cargando estado de Voicemeeter...
            </div>
        )
    }

    const titleMap: Record<typeVM, string> = {
        'voicemeeter': 'Voicemeeter Standard',
        'voicemeeterBanana': 'Voicemeeter Banana',
        'voicemeeterPotato': 'Voicemeeter Potato',
    }

    const title = titleMap[status.type] || status.type.toUpperCase()

    return (
        <div class="flex flex-col gap-8 p-4 text-white">
            <h1 class="text-3xl font-bold text-center mb-4">
                🎧 {title}
            </h1>

            <div className="flex flex-wrap gap-8">
                <InputsPanel inputs={status.inputs} />
                <VirtualInputsPanel inputs={status.virtualsInputs} />
                <BusesPanel buses={status.buses} />
            </div>
        </div>
    )
}
