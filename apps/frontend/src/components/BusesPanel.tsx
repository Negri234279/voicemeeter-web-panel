import type { BusVM } from "../types/status"
import InputBus from "./InputBus"

export default function BusesPanel({ buses }: { buses: BusVM[] }) {
    return (
        <section>
            <h2 class="text-xl font-semibold mb-2">🎚️ Master Section</h2>
            <div class="flex flex-wrap gap-6 pb-2">
                {buses.map((input) => (
                    <InputBus
                        key={input.input}
                        input={input}
                    />
                ))}
            </div>
        </section>
    )
}
