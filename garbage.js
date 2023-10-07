promH.textContent = `Average Hue: ${huePerFrame.reduce((a, b) => a + b, 0) / huePerFrame.length}`;
promS.textContent = `Average Saturation: ${saturationPerFrame.reduce((a, b) => a + b, 0) / saturationPerFrame.length}`;
promB.textContent = `Average Brightness: ${brightnessPerFrame.reduce((a, b) => a + b, 0) / brightnessPerFrame.length}`;