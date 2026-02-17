const upload = document.getElementById('upload');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const pixelSizeSlider = document.getElementById('pixelSize');
const pixelSizeValue = document.getElementById('pixelSizeValue');
const downloadBtn = document.getElementById('download');

let img = new Image();

upload.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(event) {
    img.src = event.target.result;
  }
  reader.readAsDataURL(file);
});

img.onload = function() {
  canvas.width = img.width;
  canvas.height = img.height;
  drawPixelated();
}

pixelSizeSlider.addEventListener('input', () => {
  pixelSizeValue.textContent = pixelSizeSlider.value;
  if (img.src) drawPixelated();
});

function drawPixelated() {
  const pixelSize = parseInt(pixelSizeSlider.value);

  const tempCanvas = document.createElement('canvas');
  const tCtx = tempCanvas.getContext('2d');

  tempCanvas.width = Math.ceil(img.width / pixelSize);
  tempCanvas.height = Math.ceil(img.height / pixelSize);

  tCtx.drawImage(img, 0, 0, tempCanvas.width, tempCanvas.height);

  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(tempCanvas, 0, 0, canvas.width, canvas.height);
}

downloadBtn.addEventListener('click', () => {
  const dataURL = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.href = dataURL;
  link.download = 'pixelated-image.png';
  link.click();
});
