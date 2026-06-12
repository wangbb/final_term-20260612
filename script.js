let cols = 0;
let rows = 0;
let cellSize = 42;
let grid = [];
let artworkStarted = false;

const startButton = document.getElementById("startButton");
const backButton = document.getElementById("backButton");
const landing = document.getElementById("landing");
const artwork = document.getElementById("artwork");

startButton.addEventListener("click", () => {
  artworkStarted = true;
  landing.classList.add("is-hidden");
  artwork.classList.add("is-active");
  resizeCanvas(windowWidth, windowHeight);
  buildGrid();
});

backButton.addEventListener("click", () => {
  artworkStarted = false;
  artwork.classList.remove("is-active");
  landing.classList.remove("is-hidden");
});

function setup() {
  const canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("canvasContainer");
  noStroke();
  rectMode(CENTER);
  colorMode(HSB, 360, 100, 100, 100);
  buildGrid();
}

function draw() {
  if (!artworkStarted) {
    return;
  }

  const hueShift = map(mouseY, 0, height, 0, 180, true);
  drawGradientBackground(hueShift);
  drawTransparentBlocks(hueShift);
}

function buildGrid() {
  cols = Math.ceil(width / cellSize) + 2;
  rows = Math.ceil(height / cellSize) + 2;
  grid = [];

  for (let y = 0; y < rows; y += 1) {
    const row = [];
    for (let x = 0; x < cols; x += 1) {
      row.push({
        x: x * cellSize - cellSize / 2,
        y: y * cellSize - cellSize / 2,
        offset: random(TWO_PI),
        tone: random(18, 74)
      });
    }
    grid.push(row);
  }
}

function drawGradientBackground(hueShift) {
  for (let y = 0; y < height; y += 1) {
    const inter = map(y, 0, height, 0, 1);
    const hueValue = (198 + hueShift + inter * 92) % 360;
    stroke(hueValue, 66, 28 + inter * 40, 100);
    line(0, y, width, y);
  }
  noStroke();
}

function drawTransparentBlocks(hueShift) {
  const mouseScale = map(mouseX, 0, width, 0.35, 1.45, true);
  const pulse = sin(frameCount * 0.05) * 0.08;

  for (let y = 0; y < grid.length; y += 1) {
    for (let x = 0; x < grid[y].length; x += 1) {
      const block = grid[y][x];
      const distanceToMouse = dist(mouseX, mouseY, block.x, block.y);
      const influence = map(distanceToMouse, 0, width * 0.65, 1.35, 0.74, true);
      const size = cellSize * (mouseScale + pulse + sin(block.offset + frameCount * 0.038) * 0.08) * influence;
      const hueValue = (block.tone + hueShift + x * 3 + y * 5) % 360;

      fill(hueValue, 72, 96, 24);
      rect(block.x, block.y, size, size, 7);

      fill((hueValue + 34) % 360, 38, 100, 10);
      rect(block.x, block.y, size * 0.58, size * 0.58, 4);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  buildGrid();
}
