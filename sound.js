import data from './userData.json' assert { type: 'json' };
import scribble from 'scribbletune';

const chords = [];
const chordsToUse = [];
const notes = [];
const notesToUse = [];
let patternChord = "";
let patternNote = "";

function musicCreator(frames, huePerFrame, saturationPerFrame, brightnessPerFrame, totalAverageHue, totalAverageSaturation, totalAverageBrightness, spikeHue, spikeSaturation, spikeBrightness, duration, bpmVar) {
    const chords = [];
    const notes = [];
    const chordsToUse = [];
    let value;

    // Scale
    if (totalAverageHue > 180) {
        chords.push('CM', 'Dm', 'Em', 'FM', 'GM', 'Am', 'Bo');
        notes.push('C3', 'D3', 'E3', 'F3', 'G3', 'A3', 'B3', 'C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4');
    } else {
        chords.push('DbM', 'Ebm', 'Fm', 'GbM', 'AbM', 'Bbm', 'Co');
        notes.push('Db3', 'Eb3', 'F3', 'Gb3', 'Ab3', 'Bb3', 'C4', 'Db4', 'Eb4', 'F4', 'Gb4', 'Ab4', 'Bb4','C5');
    }

    // Chords
    const pulsesPerTime = Math.round(((frames.length / duration) * 60) / bpmVar / 4);

    let counterSpike = 0;

    for (let i = 0; i < frames.length; i += pulsesPerTime) {
        value = brightnessPerFrame[i];

        switch (true) {
            case value >= 0 && value <= 14:
                chordsToUse.push(chords[0]);
                break;
            case value >= 14 && value <= 28:
                chordsToUse.push(chords[1]);
                break;
            case value >= 28 && value <= 42:
                chordsToUse.push(chords[2]);
                break;
            case value >= 42 && value <= 56:
                chordsToUse.push(chords[3]);
                break;
            case value >= 56 && value <= 70:
                chordsToUse.push(chords[4]);
                break;
            case value >= 70 && value <= 84:
                chordsToUse.push(chords[5]);
                break;
            case value >= 84 && value <= 100:
                chordsToUse.push(chords[6]);
                break;
            default:
                console.log("Value not in any chord range");
                break;
        }

        if (i < brightnessPerFrame.length - 1) {  // Evitar salir del array
            if (brightnessPerFrame[i] > spikeBrightness[counterSpike]) {
                patternChord += 'x';
                counterSpike = Math.min(counterSpike + 1, spikeBrightness.length - 1);  // No superar la longitud de spikeBrightness
            } else {
                patternChord += '_';
            }
        }
    }

    // Notes
    counterSpike = 0;

    for (let i = 0; i < frames.length; i += pulsesPerTime) {
        value = saturationPerFrame[i];
        console.log(value);

        switch (true) {
            case value >= 0 && value <= 7:
                notesToUse.push(notes[0]);
                break;
            case value >= 7 && value <= 14:
                notesToUse.push(notes[1]);
                break;
            case value >= 14 && value <= 21:
                notesToUse.push(notes[2]);
                break;
            case value >= 21 && value <= 28:
                notesToUse.push(notes[3]);
                break;
            case value >= 28 && value <= 35:
                notesToUse.push(notes[4]);
                break;
            case value >= 35 && value <= 42:
                notesToUse.push(notes[5]);
                break;
            case value >= 42 && value <= 49:
                notesToUse.push(notes[6]);
                break;
            case value >= 49 && value <= 56:
                notesToUse.push(notes[7]);
                break;
            case value >= 56 && value <= 63:
                notesToUse.push(notes[8]);
                break;
            case value >= 63 && value <= 70:
                notesToUse.push(notes[9]);
                break;
            case value >= 70 && value <= 77:
                notesToUse.push(notes[10]);
                break;
            case value >= 77 && value <= 84:
                notesToUse.push(notes[11]);
                break;
            case value >= 84 && value <= 91:
                notesToUse.push(notes[12]);
                break;
            case value >= 91 && value <= 100:
                notesToUse.push(notes[13]);
                break;
            default:
                console.log("Value not in any note range");
                break;
        }

        if (i < saturationPerFrame.length - 1) {  // Evitar salir del array
            if (saturationPerFrame[i] > spikeSaturation[counterSpike]) {
                patternNote += 'x';
                counterSpike = Math.min(counterSpike + 1, spikeSaturation.length - 1);  // No superar la longitud de spikeBrightness
                console.log("Spike");
            } else {
                patternNote += '_';
                console.log("Spike");
            }
        }
    }

    console.log(notesToUse);
    console.log(patternNote);
    console.log(chordsToUse);
    console.log(patternChord);
    console.log(scribble.scale('Db4 major'));

    const melody = scribble.clip({
        notes: notesToUse,
        pattern: patternNote
    });
    
    scribble.midi(melody, 'melody.mid');

    const chord = scribble.clip({
        notes: chordsToUse,
        pattern: patternChord
    });
    
    scribble.midi(chord, 'chord.mid');
}

const { frames, huePerFrame, saturationPerFrame, brightnessPerFrame, totalAverageHue, totalAverageSaturation, totalAverageBrightness, spikeHue, spikeSaturation, spikeBrightness, duration, bpmVar } = data;

musicCreator(frames, huePerFrame, saturationPerFrame, brightnessPerFrame, totalAverageHue, totalAverageSaturation, totalAverageBrightness, spikeHue, spikeSaturation, spikeBrightness, duration, bpmVar);
