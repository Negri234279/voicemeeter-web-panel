import type { JSX } from "preact/jsx-runtime"

interface ControlButtonProps extends Omit<JSX.HTMLAttributes<HTMLButtonElement>, 'class'> {
    label: string | JSX.Element
    active: boolean
    colorActive?: string
    colorInactive?: string
    class?: string
}

export default function ControlButton({
    label,
    active,
    colorActive = "red",
    colorInactive = "slate",
    class: extraClass = "",
    ...rest
}: ControlButtonProps) {
    return (
        <button
            {...rest}
            class={`py-1 px-2.5 rounded font-semibold transition-colors bg-transparent border cursor-pointer ${active ? colorActive : colorInactive} ${extraClass}`}
        >
            {label}
        </button>
    )
}