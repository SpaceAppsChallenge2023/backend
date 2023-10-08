const melody = scribble.clip({
    notes: notesToUse,
    pattern: patternNote
});

scribble.midi(melody, 'melody.mid');