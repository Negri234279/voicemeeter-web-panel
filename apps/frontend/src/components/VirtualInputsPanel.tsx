import type { VirtualInputVM } from "../types/status"
import InputStrip from "./InputStrip"

export default function VirtualInputsPanel({
    inputs,
}: {
        inputs: VirtualInputVM[]
}) {
    return (
        <section>
            <h2 class="text-xl font-semibold mb-2">🎚️ Virtual Inputs</h2>
            <div class="flex flex-wrap gap-6 pb-2">
                {inputs.map((input) => (
                    <InputStrip
                        key={input.input}
                        input={input}
                    />
                ))}
            </div>
        </section>
    )
}
