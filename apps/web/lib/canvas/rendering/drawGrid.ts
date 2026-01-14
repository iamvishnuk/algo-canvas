import { ViewState } from '@algocanvas/types/canvas';
import { RefObject } from 'react';

export const drawGrid = (
  bgCanvasRef: RefObject<HTMLCanvasElement | null>,
  view: ViewState
) => {
  const canvas = bgCanvasRef.current;
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const { scale, offsetX, offsetY } = view;
  const width = canvas.width;
  const height = canvas.height;

  ctx.fillStyle = '#03060D';
  ctx.fillRect(0, 0, width, height);

  ctx.save();
  ctx.translate(offsetX, offsetY);
  ctx.scale(scale, scale);

  const gridSize = 40;
  const startX = Math.floor(-offsetX / scale / gridSize) * gridSize;
  const startY = Math.floor(-offsetY / scale / gridSize) * gridSize;
  const endX = Math.ceil((width - offsetX) / scale / gridSize) * gridSize;
  const endY = Math.ceil((height - offsetY) / scale / gridSize) * gridSize;

  ctx.strokeStyle = '#333';
  ctx.lineWidth = 1 / scale;

  for (let x = startX; x <= endX; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, startY);
    ctx.lineTo(x, endY);
    ctx.stroke();
  }

  for (let y = startY; y <= endY; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(startX, y);
    ctx.lineTo(endX, y);
    ctx.stroke();
  }

  ctx.restore();
};
