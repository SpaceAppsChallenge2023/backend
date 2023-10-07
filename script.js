const fileInput = document.getElementById('fileInput');
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const feedbackH = document.getElementById('feedbackH');
const feedbackS = document.getElementById('feedbackS');
const feedbackB = document.getElementById('feedbackB');
const promH = document.getElementById('promH');
const promS = document.getElementById('promS');
const promB = document.getElementById('promB');
const bpm = document.getElementById('bpm');

const huePerFrame = [];
const saturationPerFrame = [];
const brightnessPerFrame = [];
const frames = [];
let counter = 0;

function calculateDeviation(arr) {
    const mean = arr.reduce((sum, val) => sum + val, 0) / arr.length;
    const squaredDifferences = arr.map((val) => Math.pow(val - mean, 2));
    const variance = squaredDifferences.reduce((sum, val) => sum + val, 0) / arr.length;
    return Math.sqrt(variance);
}

function findFarthestElement(arr) {
    const mean = arr.reduce((sum, val) => sum + val, 0) / arr.length;
    let farthestIndex = 0;
    let farthestDistance = Math.abs(arr[0] - mean);

    for (let i = 1; i < arr.length; i++) {
        const distance = Math.abs(arr[i] - mean);
        if (distance > farthestDistance) {
            farthestDistance = distance;
            farthestIndex = i;
        }
    }

    return arr[farthestIndex];
}

function processArray(inputArray) {
    const resultArray = [];
    const segmentSize = 30;

    for (let i = 0; i < inputArray.length; i += segmentSize) {
        const segment = inputArray.slice(i, i + segmentSize);
        const deviation = calculateDeviation(segment);

        if (deviation > 0.2) { // 20% deviation
            const farthestElement = findFarthestElement(segment);
            resultArray.push(farthestElement);
        }
    }

    return resultArray;
}

// Function to process each video frame
function processFrame() {
    counter++;
    frames.push(counter);

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Get pixel data from the canvas
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

    // Calculate the average HSB values of the frame
    let totalHue = 0;
    let totalSaturation = 0;
    let totalBrightness = 0;

    for (let i = 0; i < imageData.length; i += 4) {
        // Extract RGB values
        const r = imageData[i] / 255;
        const g = imageData[i + 1] / 255;
        const b = imageData[i + 2] / 255;

        // Calculate HSB values
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const delta = max - min;

        let hue = 0;
        let saturation = 0;
        let brightness = max;

        if (delta !== 0) {
            if (max === r) {
                hue = ((g - b) / delta) % 6;
            } else if (max === g) {
                hue = (b - r) / delta + 2;
            } else {
                hue = (r - g) / delta + 4;
            }
            hue = Math.round(hue * 60);
            if (hue < 0) {
                hue += 360;
            }
            saturation = delta / max;
        }

        totalHue += hue;
        totalSaturation += saturation * 100;
        totalBrightness += brightness * 100;
    }

    const averageHue = totalHue / (imageData.length / 4);
    const averageSaturation = totalSaturation / (imageData.length / 4);
    const averageBrightness = totalBrightness / (imageData.length / 4);

    // Add the average HSB values to the arrays
    huePerFrame.push(averageHue);
    saturationPerFrame.push(averageSaturation);
    brightnessPerFrame.push(averageBrightness);

    // Provide feedback based on HSB values
    feedbackH.textContent = `Average Hue: ${averageHue.toFixed(2)}°`;
    feedbackS.textContent = `Average Saturation: ${averageSaturation.toFixed(2)}`;
    feedbackB.textContent = `Average Brightness: ${averageBrightness.toFixed(2)}`;

    // Request the next frame
    requestAnimationFrame(processFrame);
}

// Event listener for file input change
fileInput.addEventListener('change', () => {
    const selectedFile = fileInput.files[0];
    if (selectedFile) {
        // Load the selected video file into the video element
        video.src = URL.createObjectURL(selectedFile);
        video.addEventListener('loadedmetadata', () => {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            video.play();
            requestAnimationFrame(processFrame);
        });
        video.addEventListener('ended', () => {
            // Video has ended, calculate the average of HSB values
            promH.textContent = `Average Hue: ${huePerFrame.reduce((a, b) => a + b, 0) / huePerFrame.length}`;
            promS.textContent = `Average Saturation: ${saturationPerFrame.reduce((a, b) => a + b, 0) / saturationPerFrame.length}`;
            promB.textContent = `Average Brightness: ${brightnessPerFrame.reduce((a, b) => a + b, 0) / brightnessPerFrame.length}`;
            bpm.textContent = `BPM: ${(processArray(huePerFrame).length + processArray(saturationPerFrame).length +processArray(brightnessPerFrame).length)/3}`;

        });
    }
});