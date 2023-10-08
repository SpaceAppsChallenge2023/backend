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

// Arrays to store HSB values per frame, frames counter, and animation frame request ID
const huePerFrame = [];
const saturationPerFrame = [];
const brightnessPerFrame = [];
const frames = [];
let counter = 0;
let totalAverageHue = 0;
let totalAverageSaturation = 0;
let totalAverageBrightness = 0;
let spikeHue = 0;
let spikeSaturation = 0;
let spikeBrightness = 0;
let bpmVar = 0;
let requestID;

// Function to calculate deviation of an array
function calculateDeviation(arr) {
    const mean = arr.reduce((sum, val) => sum + val, 0) / arr.length;
    const squaredDifferences = arr.map((val) => Math.pow(val - mean, 2));
    const variance = squaredDifferences.reduce((sum, val) => sum + val, 0) / arr.length;
    return Math.sqrt(variance);
}

// Function to find the farthest 'n' elements from a segment
function findFarthestElements(segment, n) {
    const farthestElements = [];
    
    for (let i = 0; i < n; i++) {
        let farthestElement = null;
        let maxDistance = -1;

        for (let j = 0; j < segment.length; j++) {
            const distance = calculateDistance(segment[i], segment[j]);

            if (distance > maxDistance) {
                maxDistance = distance;
                farthestElement = segment[j];
            }
        }

        farthestElements.push(farthestElement);
    }

    return farthestElements;
}

// Function to calculate distance (you can replace this with your own distance calculation logic)
function calculateDistance(a, b) {
    return Math.abs(a - b);
}


// Function to process an array and return values with deviations > 0.2
function processArray(inputArray) {
    const resultArray = [];
    const segmentSize = 30;

    for (let i = 0; i < inputArray.length; i += segmentSize) {
        const segment = inputArray.slice(i, i + segmentSize);
        const deviation = calculateDeviation(segment);

        if (deviation > 0.2) { 
            const farthestElement = findFarthestElements(segment, 5);
            resultArray.push(...farthestElement);
        }
    }
    return resultArray;
}

// Function to process each video frame
function processFrame() {
    counter++;
    frames.push(counter);

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Extracting and calculating average HSB values of frame, and adding to arrays
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let totalHue = 0, totalSaturation = 0, totalBrightness = 0;

    // ... (Calculations for totalHue, totalSaturation, totalBrightness here, refer to original code for details)
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

    huePerFrame.push(Math.round((averageHue + Number.EPSILON) * 100) / 100);
    saturationPerFrame.push(Math.round((averageSaturation + Number.EPSILON) * 100) / 100);
    brightnessPerFrame.push(Math.round((averageBrightness + Number.EPSILON) * 100) / 100);

    // Update feedback and request the next frame
    feedbackH.textContent = `Average Hue: ${averageHue.toFixed(2)}°`;
    feedbackS.textContent = `Average Saturation: ${averageSaturation.toFixed(2)}`;
    feedbackB.textContent = `Average Brightness: ${averageBrightness.toFixed(2)}`;

    updateCharts();
    requestID = requestAnimationFrame(processFrame);
}

// Event listener for video end
video.addEventListener('ended', () => {
    cancelAnimationFrame(requestID);

    totalAverageHue = Math.round(((huePerFrame.reduce((a, b) => a + b, 0) / huePerFrame.length) + Number.EPSILON) * 100) / 100;
    totalAverageSaturation = Math.round(((saturationPerFrame.reduce((a, b) => a + b, 0) / saturationPerFrame.length) + Number.EPSILON) * 100) / 100;
    totalAverageBrightness = Math.round(((brightnessPerFrame.reduce((a, b) => a + b, 0) / brightnessPerFrame.length) + Number.EPSILON) * 100) / 100;
    spikeHue = processArray(huePerFrame);
    spikeSaturation = processArray(saturationPerFrame);
    spikeBrightness = processArray(brightnessPerFrame);
   
    const sumSpikes = Math.round((spikeHue.length + spikeSaturation.length + spikeBrightness.length));
    const duration = video.duration;
    const durationPerMin = (duration / 60) + 1;
    bpmVar = Math.round(sumSpikes / durationPerMin);

    console.log(spikeHue);
    console.log(spikeSaturation);
    console.log(spikeBrightness);

    promH.textContent = `Total Average Hue: ${totalAverageHue}`;
    promS.textContent = `Total Average Saturation: ${totalAverageSaturation}`;
    promB.textContent = `Total Average Brightness: ${totalAverageBrightness}`;
    bpm.textContent = `BPM: ${bpmVar}`;

    const videoAnalysisEvent = new CustomEvent('videoAnalysisCompleted', {
        detail: {
            frames,
            huePerFrame,
            saturationPerFrame,
            brightnessPerFrame,
            totalAverageHue,
            totalAverageSaturation,
            totalAverageBrightness,
            spikeHue,
            spikeSaturation,
            spikeBrightness,
            duration,
            bpmVar
        }
    });
    document.dispatchEvent(videoAnalysisEvent);

    fileInput.removeEventListener('change', handleFileInputChange);
});

document.addEventListener('videoAnalysisCompleted', () => {
    const duration = video.duration;
    const analysisData = {
        frames: frames,
        huePerFrame: huePerFrame,
        saturationPerFrame: saturationPerFrame,
        brightnessPerFrame: brightnessPerFrame,
        totalAverageHue: totalAverageHue,
        totalAverageSaturation: totalAverageSaturation,
        totalAverageBrightness: totalAverageBrightness,
        spikeHue: spikeHue,
        spikeSaturation: spikeSaturation,
        spikeBrightness: spikeBrightness,
        duration: duration,
        bpmVar: bpmVar
    };

    const jsonData = JSON.stringify(analysisData);

    // Puedes imprimir el JSON en la consola o usarlo según tus necesidades
    console.log(jsonData);

    localStorage.setItem('jsonData', jsonData);

    // También puedes enviar el JSON a un servidor si es necesario
    // Puedes usar fetch o alguna otra librería para esto
});

// Event listener for file input change
fileInput.addEventListener('change', handleFileInputChange);

function handleFileInputChange() {
    const selectedFile = fileInput.files[0];
    if (selectedFile) {
        video.src = URL.createObjectURL(selectedFile);
        video.addEventListener('loadedmetadata', () => {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            video.play();
            requestID = requestAnimationFrame(processFrame);
        });
    }
}

// Function to update the charts
function updateCharts() {
    // ... (Your chart update logic goes here)
    hueChart.update();
    saturationChart.update();
    brightnessChart.update();
}

const hueChart = new Chart(document.getElementById('hueChart').getContext('2d'), {
    type: 'line',
    data: {
        labels: frames,
        datasets: [{
            label: 'Hue',
            data: huePerFrame,
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
            fill: false,
        }]
    },
    options: {
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Frame Number',
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Hue (°)',
                }
            }
        }
    }
});

// Create a line chart for Saturation
const saturationChart = new Chart(document.getElementById('saturationChart').getContext('2d'), {
    type: 'line',
    data: {
        labels: frames,
        datasets: [{
            label: 'Saturation',
            data: saturationPerFrame,
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
            fill: false,
        }]
    },
    options: {
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Frame Number',
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Saturation',
                }
            }
        }
    }
});

// Create a line chart for Brightness
const brightnessChart = new Chart(document.getElementById('brightnessChart').getContext('2d'), {
    type: 'line',
    data: {
        labels: frames,
        datasets: [{
            label: 'Brightness',
            data: brightnessPerFrame,
            borderColor: 'rgba(255, 206, 86, 1)',
            borderWidth: 1,
            fill: false,
        }]
    },
    options: {
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Frame Number',
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Brightness',
                }
            }
        }
    }
});

function exportData() {
    // Retrieve data from LocalStorage
    const data = JSON.parse(localStorage.getItem("jsonData"));

    // Create a JSON Blob
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });

    // Create a temporary URL for the Blob
    const url = window.URL.createObjectURL(blob);

    // Create a download link
    const a = document.createElement("a");
    a.href = url;
    a.download = "userData.json";
    
    // Trigger the click event to download
    a.click();

    // Release the Object URL
    window.URL.revokeObjectURL(url);
}

// Attach exportData function to the button click event
document.getElementById("exportButton").addEventListener("click", exportData);