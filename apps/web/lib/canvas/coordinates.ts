// Convert mouse (screen) coordinates to canvas world coordinates

import { ViewState } from '@algocanvas/types/canvas';
import { RefObject } from 'react';

// so drawing works correctly with pan (offset) and zoom (scale)
export const screenToWorld = (
  screenX: number,
  screenY: number,
  drawCanvasRef: RefObject<HTMLCanvasElement | null>,
  view: ViewState
) => {
  const canvas = drawCanvasRef.current;

  // If canvas is not available, return a safe default
  if (!canvas) return { x: 0, y: 0 };

  // Canvas position relative to the viewport
  const rect = canvas.getBoundingClientRect();

  // Apply inverse pan and zoom to get world-space coordinates
  const x = (screenX - rect.left - view.offsetX) / view.scale;
  const y = (screenY - rect.top - view.offsetY) / view.scale;

  return { x, y };
};
