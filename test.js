const melody = scribble.clip({
    notes: notesToUse,
    pattern: patternNote,
    sizzle: true
});

scribble.midi(melody, 'melody.mid');