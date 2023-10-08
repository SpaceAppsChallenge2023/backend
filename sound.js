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

    // Scale
    if (totalAverageHue > 180) {
        chords.push('CM', 'Dm', 'Em', 'FM', 'GM', 'Am', 'Bo');
        notes.push('C3', 'D3', 'E3', 'F3', 'G3', 'A3', 'B3', 'C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4');
    } else {
        chords.push('C_M', 'D_m', 'Fm', 'F_M', 'G_M', 'A_m', 'Co');
        notes.push('C_3', 'D_3', 'F3', 'F_3', 'G_3', 'A_3', 'C4', 'D_4', 'F4', 'F_4', 'G_4', 'A_4', 'C5');
    }

    // Chords
    const pulsesPerTime = Math.round(((frames.length / duration) * 60) / bpmVar / 4);

    let counterSpike = 0;

    for (let i = 0; i < frames.length; i += pulsesPerTime) {
        value = brightnessPerFrame[i];

        switch (true) {
            case value >= 0 && value <= 13:
                chordsToUse.push(chords[0]);
                break;
            case value >= 14 && value <= 27:
                chordsToUse.push(chords[1]);
                break;
            case value >= 28 && value <= 41:
                chordsToUse.push(chords[2]);
                break;
            case value >= 42 && value <= 55:
                chordsToUse.push(chords[3]);
                break;
            case value >= 56 && value <= 69:
                chordsToUse.push(chords[4]);
                break;
            case value >= 70 && value <= 83:
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
    counterSpike = 0

    for (let i = 0; i < frames.length; i += pulsesPerTime) {
        value = saturationPerFrame[i];

        switch (true) {
            case value >= 0 && value <= 6:
                notesToUse.push(notes[0]);
                break;
            case value >= 7 && value <= 13:
                notesToUse.push(notes[1]);
                break;
            case value >= 14 && value <= 20:
                notesToUse.push(notes[2]);
                break;
            case value >= 21 && value <= 27:
                notesToUse.push(notes[3]);
                break;
            case value >= 28 && value <= 34:
                notesToUse.push(notes[4]);
                break;
            case value >= 35 && value <= 41:
                notesToUse.push(notes[5]);
                break;
            case value >= 42 && value <= 48:
                notesToUse.push(notes[6]);
                break;
            case value >= 49 && value <= 55:
                notesToUse.push(notes[7]);
                break;
            case value >= 56 && value <= 62:
                notesToUse.push(notes[8]);
                break;
            case value >= 63 && value <= 69:
                notesToUse.push(notes[9]);
                break;
            case value >= 70 && value <= 76:
                notesToUse.push(notes[10]);
                break;
            case value >= 77 && value <= 83:
                notesToUse.push(notes[11]);
                break;
            case value >= 84 && value <= 90:
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
            } else {
                patternNote += '_';
            }
        }
    }


    console.log(notesToUse);
    console.log(patternNote);
}

document.addEventListener('videoAnalysisCompleted', (event) => {
    const { frames, huePerFrame, saturationPerFrame, brightnessPerFrame, totalAverageHue, totalAverageSaturation, totalAverageBrightness, spikeHue, spikeSaturation, spikeBrightness, duration, bpmVar } = event.detail;
    // Utilizar las variables para realizar operaciones en sound.js
    console.log('Video Analysis Completed!');
    console.log(`Total Hue: ${totalAverageHue}`);
    console.log(`Total Saturation: ${totalAverageSaturation}`);
    console.log(`Total Brightness: ${totalAverageBrightness}`);
    console.log(`BPM: ${bpmVar}`);
    console.log(`${duration}`);

    // Si quieres modificar algo en el HTML para demostrar que sound.js se ha ejecutado:
    document.getElementById('feedbackH').innerHTML += `<br>Sound.js - Total Hue: ${totalAverageHue}`;

    musicCreator(frames, huePerFrame, saturationPerFrame, brightnessPerFrame, totalAverageHue, totalAverageSaturation, totalAverageBrightness, spikeHue, spikeSaturation, spikeBrightness, duration, bpmVar);

});
