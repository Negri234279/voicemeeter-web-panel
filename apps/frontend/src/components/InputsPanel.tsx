
import type { InputVM } from "../types/status"
import InputStrip from "./InputStrip"

interface Props {
    inputs: InputVM[]
}

export default function InputsPanel({ inputs }: Props) {
    return (
        <section>
            <h2 class="text-xl font-semibold mb-2">🎚️ Inputs</h2>
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
