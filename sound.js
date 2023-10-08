import data from './userData.json' assert { type: 'json' };
import scribble from 'scribbletune';

const chords = [];
const chordsToUse = [];
const notes = [];
const notesToUse = [];
const rhythms = [];
const rhythmToUse = [];
let patternChord = "";
let patternNote = "";
let patternRhythm = "";

function musicCreator(frames, huePerFrame, saturationPerFrame, brightnessPerFrame, totalAverageHue, totalAverageSaturation, totalAverageBrightness, spikeHue, spikeSaturation, spikeBrightness, duration, bpmVar) {
    const chords = [];
    const notes = [];
    const chordsToUse = [];
    let value;

    // Scale
    if (totalAverageHue > 180) {
        chords.push('CM', 'Dm', 'Em', 'FM', 'GM', 'Am', 'Bm');
        notes.push('C3', 'D3', 'E3', 'F3', 'G3', 'A3', 'B3', 'C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4');
    } else {
        chords.push('DbM', 'Ebm', 'Fm', 'GbM', 'AbM', 'Bbm', 'Cm');
        notes.push('Db3', 'Eb3', 'F3', 'Gb3', 'Ab3', 'Bb3', 'C4', 'Db4', 'Eb4', 'F4', 'Gb4', 'Ab4', 'Bb4','C5');
    }

    // Chords
    const pulsesPerTime = Math.round(((frames.length / duration) * 60) / bpmVar / 4);
    let counterSpike = 0;
    let checkForUpperThreshold = true;

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

        if (checkForUpperThreshold && (value >= spikeBrightness[counterSpike] - 12)) {
            (Math.random() > 0.9) ? patternChord += 'x' : patternChord += '_';
            checkForUpperThreshold = false;  // alternar el tipo de umbral que estamos buscando
        } else if (!checkForUpperThreshold && (value <= spikeBrightness[counterSpike] + 12)) {
            (Math.random() > 0.9) ? patternChord += 'x' : patternChord += '_';
            checkForUpperThreshold = true;  // alternar el tipo de umbral que estamos buscando
        } else {
            (Math.random() > 0.9) ? patternChord += 'x' : patternChord += '_';
        }

        if (patternChord.charAt(patternChord.length-1) === 'x' && counterSpike < spikeBrightness.length - 1) {
            counterSpike++;
        }
    }

    // Notes
    counterSpike = 0;
    checkForUpperThreshold = true;

    for (let i = 0; i < frames.length; i += pulsesPerTime) {
        value = saturationPerFrame[i];

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

        if (checkForUpperThreshold && (value >= spikeSaturation[counterSpike] - 37.58)) {
            (Math.random() > 0.2) ? patternNote += 'x' : patternNote += '_';
            checkForUpperThreshold = false;  // alternar el tipo de umbral que estamos buscando
        } else if (!checkForUpperThreshold && (value <= spikeSaturation[counterSpike] + 37.58)) {
            (Math.random() > 0.2) ? patternNote += 'x' : patternNote += '_';
            checkForUpperThreshold = true;  // alternar el tipo de umbral que estamos buscando
        } else {
            (Math.random() > 0.9) ? patternNote += 'x' : patternNote += '_';
        }

        if (patternNote.charAt(patternNote.length-1) === 'x' && counterSpike < spikeSaturation.length - 1) {
            counterSpike++;
        }
    }
    
    // Rhythm
    counterSpike = 0;
    checkForUpperThreshold = true;

    for (let i = 0; i < frames.length; i += pulsesPerTime) {
        value = huePerFrame[i];

        rhythmToUse.push('C3');

        if (checkForUpperThreshold && (value >= spikeHue[counterSpike] - 37.58)) {
            (Math.random() > 0.2) ? patternRhythm += 'x' : patternRhythm += '_';
            checkForUpperThreshold = false;  // alternar el tipo de umbral que estamos buscando
        } else if (!checkForUpperThreshold && (value <= spikeHue[counterSpike] + 37.58)) {
            (Math.random() > 0.2) ? patternRhythm += 'x' : patternRhythm += '_';
            checkForUpperThreshold = true;  // alternar el tipo de umbral que estamos buscando
        } else {
            (Math.random() > 0.9) ? patternRhythm += 'x' : patternNote += '_';
        }

        if (patternNote.charAt(patternRhythm.length-1) === 'x' && counterSpike < spikeHue.length - 1) {
            counterSpike++;
        }
    }

    console.log(saturationPerFrame);
    console.log(spikeSaturation);

    console.log(notesToUse);
    console.log(patternNote);
    console.log(chordsToUse);
    console.log(patternChord);
    console.log(rhythmToUse);
    console.log(patternRhythm);

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

    const rhythm = scribble.clip({
        notes: rhythmToUse,
        pattern: patternRhythm
    });
    
    scribble.midi(rhythm, 'rhythm.mid');
}

const { frames, huePerFrame, saturationPerFrame, brightnessPerFrame, totalAverageHue, totalAverageSaturation, totalAverageBrightness, spikeHue, spikeSaturation, spikeBrightness, duration, bpmVar } = data;

musicCreator(frames, huePerFrame, saturationPerFrame, brightnessPerFrame, totalAverageHue, totalAverageSaturation, totalAverageBrightness, spikeHue, spikeSaturation, spikeBrightness, duration, bpmVar);
