import { ViewState } from '@algocanvas/types/canvas';

export function drawGrid(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  view: ViewState
) {
  const gridSize = 50; // world units
  const { scale, offsetX, offsetY } = view;

  const width = canvas.width / (window.devicePixelRatio || 1);
  const height = canvas.height / (window.devicePixelRatio || 1);

  ctx.save();

  // 🔑 Reset any transform (VERY IMPORTANT)
  ctx.setTransform(1, 0, 0, 1, 0, 0);

  ctx.clearRect(0, 0, width, height);

  ctx.strokeStyle = 'rgba(255,255,255,0.08)';
  ctx.lineWidth = 1;

  // 🔑 Convert world offset → screen offset
  const startX = -offsetX % (gridSize * scale);
  const startY = -offsetY % (gridSize * scale);

  ctx.beginPath();

  // Vertical lines
  for (let x = startX; x <= width; x += gridSize * scale) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
  }

  // Horizontal lines
  for (let y = startY; y <= height; y += gridSize * scale) {
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
  }

  ctx.stroke();
  ctx.restore();
}
