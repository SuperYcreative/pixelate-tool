const upload = document.getElementById('upload');
const dropArea = document.getElementById('drop-area');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const pixelSizeSlider = document.getElementById('pixelSize');
const pixelSizeValue = document.getElementById('pixelSizeValue');
const downloadBtn = document.getElementById('download');
const fitBtn = document.getElementById('fit');
const resetBtn = document.getElementById('reset');
const instructions = document.getElementById('instructions');

let img = new Image();

// Drag-and-drop hover effect
dropArea.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropArea.classList.add('hover');
});
dropArea.addEventListener('dragleave', (e) => {
  e.preventDefault();
  dropArea.classList.remove('hover');
});
dropArea.addEventListener('drop', (e) => {
  e.preventDefault();
  dropArea.classList.remove('hover');
  const file = e.dataTransfer.files[0];
  if (file) loadImage(file);
});
window.addEventListener('dragend', () => dropArea.classList.remove('hover'));

// Click to trigger file input
dropArea.addEventListener('click', () => upload.click());

// Hide instructions function
function hideInstructions() {
  instructions.classList.add('hidden');
}

// Load image from input
upload.addEventListener('change', () => {
  const file = upload.files[0];
  if (file) {
    hideInstructions();
    loadImage(file);
  }
});

// Hide instructions on drop
dropArea.addEventListener('drop', hideInstructions);

// Load image into canvas
function loadImage(file) {
  const reader = new FileReader();
  reader.onload = function(event) {
    img.src = event.target.result;
  };
  reader.readAsDataURL(file);
}

// When image loads
img.onload = function() {
  fitToScreen();
}

// Slider live update
function updateSliderVisual(slider) {
  const value = slider.value;
  const max = slider.max;
  const percent = (value / max) * 100;
  slider.style.background = `linear-gradient(to right, #4caf50 0%, #4caf50 ${percent}%, #ddd ${percent}%, #ddd 100%)`;
}

pixelSizeSlider.addEventListener('input', () => {
  pixelSizeValue.textContent = pixelSizeSlider.value;
  updateSliderVisual(pixelSizeSlider);
  if (img.src) drawPixelated();
});

updateSliderVisual(pixelSizeSlider); // initial

// Draw pixelated image
function drawPixelated(scale = 1) {
  const pixelSize = parseInt(pixelSizeSlider.value);

  const tempCanvas = document.createElement('canvas');
  const tCtx = tempCanvas.getContext('2d');

  tempCanvas.width = Math.ceil((img.width * scale) / pixelSize);
  tempCanvas.height = Math.ceil((img.height * scale) / pixelSize);

  tCtx.drawImage(img, 0, 0, tempCanvas.width, tempCanvas.height);

  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(tempCanvas, 0, 0, canvas.width, canvas.height);
}

// Fit to screen
function fitToScreen() {
  if (!img.src) return;
  const containerWidth = Math.min(window.innerWidth * 0.8, 1000);
  const containerHeight = window.innerHeight * 0.7;

  const scaleWidth = containerWidth / img.width;
  const scaleHeight = containerHeight / img.height;
  const scale = Math.min(scaleWidth, scaleHeight, 1);

  canvas.width = img.width * scale;
  canvas.height = img.height * scale;

  drawPixelated(scale);
}

fitBtn.addEventListener('click', fitToScreen);

// Reset canvas
resetBtn.addEventListener('click', () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  img.src = '';
  upload.value = '';
  instructions.classList.remove('hidden');
});

// Download
downloadBtn.addEventListener('click', () => {
  const dataURL = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.href = dataURL;
  link.download = 'pixelated-image.png';
  link.click();
});

