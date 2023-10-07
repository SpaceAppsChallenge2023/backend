const fileInput = document.getElementById('fileInput');
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const feedbackH = document.getElementById('feedbackH');
const feedbackS = document.getElementById('feedbackS');
const feedbackB = document.getElementById('feedbackB');

const huePerFrame = [];
const saturationPerFrame = [];
const brightnessPerFrame = [];
const frames = [];
let counter = 0;

// Event listener for video end
video.addEventListener('ended', () => {
    // Stop processing frames
    cancelAnimationFrame(requestID);

    // Finalize your charts or take any other actions as needed
    // For example, you can remove the event listener for file input change
    fileInput.removeEventListener('change', handleFileInputChange);
});

// Event listener for file input change
fileInput.addEventListener('change', handleFileInputChange);

// Function to handle file input change
function handleFileInputChange() {
    const selectedFile = fileInput.files[0];
    if (selectedFile) {
        // Load the selected video file into the video element
        video.src = URL.createObjectURL(selectedFile);
        video.addEventListener('loadedmetadata', () => {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            video.play();
            requestID = requestAnimationFrame(processFrame); // Start processing frames
        });
    }
}

let requestID; // Variable to hold the requestAnimationFrame ID

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

    // Update the line charts
    hueChart.update();
    saturationChart.update();
    brightnessChart.update();

    // Request the next frame
    requestID = requestAnimationFrame(processFrame);
}

// Create a line chart for Hue
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