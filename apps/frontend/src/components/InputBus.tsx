import { useEffect, useState } from "preact/hooks"

import type { BusVM, InputVM, SendsInputVM, Status, VirtualInputVM } from "../types/status"
import ControlButton from "./ControlButton"

const sendCommand = async (command: string) => {
    try {
        await fetch("http://192.168.1.33:2999/vban/command", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ command }),
        })
    } catch (err) {
        console.error("Error enviando comando:", err)
    }
}

export default function InputBus({ input }: { input: BusVM }) {
    const [gain, setGain] = useState(input.gain)

    useEffect(() => {
        setGain(input.gain)
    }, [input.gain])

    const handleGainChange = (ev: Event) => {
        const target = ev.target as HTMLInputElement
        const newGain = parseInt(target.value)

        setGain(newGain)

        const command = `Bus[${input.input}].Gain = ${newGain}`
        sendCommand(command)
    }

    const handleGainDoubleClick = () => {
        const newGain = 0
        setGain(newGain)
        sendCommand(`Bus[${input.input}].Gain = ${newGain}`)
    }

    const handleMonoChange = async () => {
        const command = `Bus[${input.input}].Mono = ${!input.mono ? 1 : 0}`
        await sendCommand(command)
    }

    const handleSoloChange = async () => {
        const command = `Bus[${input.input}].Solo = ${!input.solo ? 1 : 0}`
        await sendCommand(command)
    }

    const handleMuteChange = async () => {
        const command = `Bus[${input.input}].Mute = ${!input.mute ? 1 : 0}`
        await sendCommand(command)
    }

    const handleEQChange = async () => {
        const command = `Bus[${input.input}].EQ.On = ${!input.eq ? 1 : 0}`
        await sendCommand(command)
    }

    return (
        <div class="bg-[#222] rounded-2xl p-3 flex flex-col items-center shadow-md">
            <h3 class="text-sm font-semibold text-center mb-2 truncate w-full">
                {input.label || `Input ${input.input + 1}`}
            </h3>

            {/* 🎚️ Fader vertical */}
            <div class="flex flex-col items-center h-[200px] relative">
                {/* Contenedor del fader */}
                <div class="relative h-[160px] flex items-center justify-center">
                    {/* Barra roja (pista del fader) */}
                    <div class={`absolute w-1 h-full rounded-full ${input.mute ? "bg-red-500" : "bg-slate-600"}`}></div>

                    {/* Fader */}
                    <input
                        type="range"
                        min="-60"
                        max="12"
                        step="1"
                        value={gain}
                        onInput={handleGainChange}
                        onDblClick={handleGainDoubleClick}
                        class="absolute h-[160px] appearance-none bg-transparent cursor-pointer accent-green-500"
                        style={{
                            transform: "rotate(-90deg)",
                            width: "160px",
                            left: "50%",
                            top: "50%",
                            transformOrigin: "center",
                            translate: "-50% -50%",
                        }}
                    />
                </div>

                {/* Valor numérico debajo */}
                <div class="mt-3 text-xs text-slate-400">{gain} dB</div>
            </div>

            {/* 🎛️ Controles */}
            <div class="flex flex-col gap-2 text-xs w-full">
                <ControlButton
                    label="Mono"
                    active={input.mono === 1 || input.mono === 2}
                    colorActive="border-blue-500 text-blue-400"
                    colorInactive="border-slate-500 text-slate-100"
                    onClick={() => handleMonoChange()}
                />

                <ControlButton
                    label="EQ"
                    active={input.eq}
                    colorActive="border-blue-500 text-blue-400"
                    colorInactive="border-slate-500 text-slate-100"
                    onClick={() => handleEQChange()}
                />

                <ControlButton
                    label="Mute"
                    active={input.mute}
                    colorActive="border-red-500 text-red-400"
                    colorInactive="border-slate-500 text-slate-100"
                    onClick={() => handleMuteChange()}
                />
            </div>
        </div>
    )
}
