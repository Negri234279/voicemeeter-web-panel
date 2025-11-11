export type typeVM = 'voicemeeter' | 'voicemeeterBanana' | 'voicemeeterPotato'

export interface SendsInputVM {
    'A1': boolean
    'A2': boolean
    'A3': boolean
    'A4': boolean
    'A5': boolean
    'B1': boolean
    'B2': boolean
}

export interface InputVM {
    input: number
    label: string
    gain: number
    mute: boolean
    solo: boolean
    mono: boolean
    sends: SendsInputVM
}

export interface VirtualInputVM {
    input: number
    label: string
    gain: number
    mute: boolean
    solo: boolean
    mono: boolean
    sends: SendsInputVM
}

export interface BusVM {
    input: number
    label: string
    gain: number
    mute: boolean
    solo: boolean
    mono: number
    eq: boolean
}

export interface Status {
    type: typeVM
    inputs: InputVM[]
    virtualsInputs: VirtualInputVM[]
    buses: BusVM[]
    vban: {
        enabled: boolean
    }
}