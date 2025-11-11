import { useEffect, useState } from "preact/hooks"

import type { InputVM, SendsInputVM, Status, VirtualInputVM } from "../types/status"
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

export default function InputStrip({ input }: { input: InputVM | VirtualInputVM }) {
    const [gain, setGain] = useState(input.gain)

    useEffect(() => {
        setGain(input.gain)
    }, [input.gain])

    const handleGainChange = (ev: Event) => {
        const target = ev.target as HTMLInputElement
        const newGain = parseInt(target.value)

        setGain(newGain)

        const command = `Strip[${input.input}].Gain = ${newGain}`
        sendCommand(command)
    }

    const handleGainDoubleClick = () => {
        const newGain = 0
        setGain(newGain)
        sendCommand(`Strip[${input.input}].Gain = ${newGain}`)
    }

    const handleMonoChange = async () => {
        const command = `Strip[${input.input}].Mono = ${!input.mono ? 1 : 0}`
        await sendCommand(command)
    }

    const handleSoloChange = async () => {
        const command = `Strip[${input.input}].Solo = ${!input.solo ? 1 : 0}`
        await sendCommand(command)
    }

    const handleMuteChange = async () => {
        const command = `Strip[${input.input}].Mute = ${!input.mute ? 1 : 0}`
        await sendCommand(command)
    }

    const handleSendChange = async (send: keyof SendsInputVM) => {
        const isActive = input.sends[send]
        const command = `Strip[${input.input}].${send} = ${!isActive ? 1 : 0}`
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
            <div class="flex flex-row sm:flex-col justify-between gap-2 text-xs w-full">
                <ControlButton
                    label={<><span class="sm:hidden">M</span><span class="hidden sm:inline">Mono</span></>}
                    active={input.mono}
                    colorActive="border-blue-500 text-blue-400"
                    colorInactive="border-slate-500 text-slate-100"
                    onClick={handleMonoChange}
                />

                <ControlButton
                    label={<><span class="sm:hidden">S</span><span class="hidden sm:inline">Solo</span></>}
                    active={input.solo}
                    colorActive="border-yellow-500 text-yellow-400"
                    colorInactive="border-slate-500 text-slate-100"
                    onClick={handleSoloChange}
                />

                <ControlButton
                    label={<><span class="sm:hidden">M</span><span class="hidden sm:inline">Mute</span></>}
                    active={input.mute}
                    colorActive="border-red-500 text-red-400"
                    colorInactive="border-slate-500 text-slate-100"
                    onClick={handleMuteChange}
                />
            </div>


            {/* Sends A/B */}
            <div class="mt-3 grid grid-cols-4 gap-1 text-center text-[10px]">
                {(Object.entries(input.sends) as [keyof SendsInputVM, boolean][]).map(([send, active]) => (
                    <ControlButton
                        label={send}
                        active={active}
                        colorActive="border-green-500 text-green-400"
                        colorInactive="border-slate-500 text-slate-100"
                        class="!px-1.5 !py-1"
                        onClick={() => handleSendChange(send)}
                    />
                ))}
            </div>
        </div>
    )
}
