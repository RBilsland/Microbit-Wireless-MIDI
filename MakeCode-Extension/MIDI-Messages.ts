/**
 * Construct MIDI messages that can be sent to Node RED for forwarding to MIDI devices.
 */

enum NoteSelection {
    B = 11,
    //% block="A#"
    As = 10,
    A = 9,
    //% block="G#"
    Gs = 8,
    G = 7,
    //% block="F#"
    Fs = 6,
    F = 5,
    E = 4,
    //% block="D#"
    Ds = 3,
    D = 2,
    //% block="C#"
    Cs = 1,
    C = 0
}

enum OctaveSelection {
    //% block="9"
    O9 = 9,
    //% block="8"
    O8 = 8,
    //% block="7"
    O7 = 7,
    //% block="6"
    O6 = 6,
    //% block="5"
    O5 = 5,
    //% block="4"
    O4 = 4,
    //% block="3"
    O3 = 3,
    //% block="2"
    O2 = 2,
    //% block="1"
    O1 = 1,
    //% block="0"
    O0 = 0,
    //% block="-1"
    Om1 = -1
}

enum VelocitySelection {
    none = 0,
    pppp = 8,
    ppp = 20,
    pp = 31,
    p = 42,
    mp = 53,
    mf = 64,
    f = 80,
    ff = 96,
    fff = 112,
    ffff = 127
}

enum MIDIMessageType {
    NoteOff = 128,
    NoteOn = 144,
    Aftertouch = 160,
    ControlChange = 176,
    ProgramChange = 192,
    ChannelPresure = 208,
    PitchBend = 224
}

//% color="#daa520" weight=90 icon="\uf001" block="MIDI Messages"
namespace midiMessages {
    let globalChannel = 1;

    function validateRange(value: number, lowerLimit: number, upperLimit: number): number {
        if (value < lowerLimit) {
            value = lowerLimit;
        }
        if (value > upperLimit) {
            value = upperLimit;
        }
        return value;
    }

    function validateChannel(channel: number): number {
        if (channel === null) {
            return validateRange(globalChannel, 1, 16);
        } else {
            return validateRange(channel, 1, 16);
        }
    }

    function validateNote(note: number): number {
        return validateRange(note, 0, 127);
    }

    function validateVelocity(velocity: number): number {
        return validateRange(velocity, 0, 127);
    }

    function validatePressure(pressure: number): number {
        return validateRange(pressure, 0, 127);
    }

    function validateControlNumber(controlNumber: number): number {
        return validateRange(controlNumber, 0, 127);
    }

    function validateControlValue(controlValue: number): number {
        return validateRange(controlValue, 0, 127);
    }

    function validateProgramNumber(programNumber: number): number {
        return validateRange(programNumber, 0, 127);
    }

    function validatePitch(pitch: number): number {
        return validateRange(pitch, 0, 16383);
    }

    //% blockId="noteSelection_conv" block="%note"
    //% blockHidden=true
    //% note.defl=NoteSelection.C
    export function noteSelection(note: NoteSelection): number {
        return note
    }

    //% blockId="octaveSelection_conv" block="%octave"
    //% blockHidden=true
    //% octave.defl=OctaveSelection.O4
    export function octaveSelection(octave: OctaveSelection): number {
        return octave
    }

    //% blockId="velocitySelection_conv" block="%velocity"
    //% blockHidden=true
    //% velocity.defl=VelocitySelection.mf
    export function velocitySelection(velocity: VelocitySelection): number {
        return velocity
    }

    //% block="play $note=noteSelection_conv||octave $octave=octaveSelection_conv"
    //% group="Notes"
    //% weight=20
    //% expandableArgumentMode="enable"
    export function fromNoteAndOctave(note: number, octave: number = OctaveSelection.O4): number {
        let midiNote = (octave * 12) + 12 + note;

        return validateNote(midiNote);
    }

    //% block="frequency $frequency"
    //% group="Notes"
    //% weight=10
    export function fromFrequency(frequency: number): number {
        return Math.round(12 * (Math.log(frequency / 220) / Math.log(2)) + 57);
    }

    //% block="note off $note||velocity $velocity=velocitySelection_conv|channel $channel"
    //% group="Commands"
    //% weight=70
    //% expandableArgumentMode="enabled"
    //% note.defl=60
    //% volocity.defl=VelocitySelection.mf
    //% channel.defl=1
    export function noteOff(note: number, velocity: number = VelocitySelection.mf, channel: number = null): string {
        return "[" + (MIDIMessageType.NoteOff + validateChannel(channel) - 1) + "," + validateNote(note) + "," + validateVelocity(velocity) + "]";
    }

    //% block="note on $note||velocity $velocity=velocitySelection_conv|channel $channel"
    //% group="Commands"
    //% weight=60
    //% expandableArgumentMode="enabled"
    //% note.defl=60
    //% volocity.defl=VelocitySelection.mf
    //% channel.defl=1
    export function noteOn(note: number, velocity: number = VelocitySelection.mf, channel: number = null): string {
        return "[" + (MIDIMessageType.NoteOn + validateChannel(channel) - 1) + "," + validateNote(note) + "," + validateVelocity(velocity) + "]";
    }

    //% block="aftertouch $note pressure $pressure||channel $channel"
    //% group="Commands"
    //% weight=50
    //% expandableArgumentMode="enabled"
    //% note.defl=60
    //% pressure.defl=63
    //% channel.defl=1
    export function aftertouch(note: number, pressure: number, channel: number = null): string {
        return "[" + (MIDIMessageType.Aftertouch + validateChannel(channel) - 1) + "," + validateNote(note) + "," + validatePressure(pressure) + "]";
    }

    //% block="control change $number value $value||channel $channel"
    //% group="Commands"
    //% weight=40
    //% expandableArgumentMode="enabled"
    //% number.defl=0
    //% value.defl=0
    //% channel.defl=1
    export function controlChange(number: number, value: number, channel: number = null): string {
        return "[" + (MIDIMessageType.ControlChange + validateChannel(channel) - 1) + "," + validateControlNumber(number) + "," + validateControlValue(value) + "]";
    }

    //% block="program change $number||channel $channel"
    //% group="Commands"
    //% weight=30
    //% expandableArgumentMode="enabled"
    //% number.defl=0
    //% channel.defl=1
    export function programChange(number: number, channel: number = null): string {
        return "[" + (MIDIMessageType.ProgramChange + validateChannel(channel) - 1) + "," + validateProgramNumber(number) + "]";
    }

    //% block="channel pressure $pressure||channel $channel"
    //% group="Commands"
    //% weight=20
    //% expandableArgumentMode="enabled"
    //% pressure.defl=63
    //% channel.defl=1
    export function channelPressure(pressure: number, channel: number = null): string {
        return "[" + (MIDIMessageType.ChannelPresure + validateChannel(channel) - 1) + "," + validatePressure(pressure) + "]";
    }

    //% block="pitch bend $pitch||channel $channel"
    //% group="Commands"
    //% weight=10
    //% expandableArgumentMode="enabled"
    //% pitch.defl=8192
    //% channel.defl=1
    export function pitchBend(pitch: number, channel: number = null): string {
        let validatedPitch = validatePitch(pitch);

        let lestSignificantPitch = validatedPitch & 127;
        let mostSignificantPitch = validatedPitch >> 7;

        return "[" + (MIDIMessageType.PitchBend + validateChannel(channel) - 1) + "," + lestSignificantPitch + "," + mostSignificantPitch + "]";
    }

    //% block="set global channel $channel"
    //% group="Global Channel"
    //% weight=20
    //% channel.defl=1
    export function setGlobalChannel(channel: number): void {
        globalChannel = channel;
    }

    //% block="get global channel"
    //% group="Global Channel"
    //% weight=10
    export function getGlobalChannel(): number {
        return globalChannel;
    }
}
