
Plotly.plot( TESTER1, [{
    frames,
    huePerFrame }], { 
    margin: { t: 0 } }, {showSendToCloud:true} );

Plotly.plot( TESTER2, [{
    frames,
    saturationPerFrame }], { 
    margin: { t: 0 } }, {showSendToCloud:true} );

Plotly.plot( TESTER3, [{
    frames,
    brightnessPerFrame }], { 
    margin: { t: 0 } }, {showSendToCloud:true} );

/* Current Plotly.js version */
console.log( Plotly.BUILD );