import {
  DrawArrow,
  DrawCircle,
  DrawLine,
  DrawPath,
  DrawPoint,
  DrawRect
} from '@algocanvas/types/canvas';
import {
  drawArrow,
  drawCircle,
  drawLine,
  drawPath,
  drawRectangle
} from './draw';

export const drawElementsPreview = (
  ctx: CanvasRenderingContext2D,
  scale: number,
  currentPath: Omit<DrawPath, 'type'> | null,
  currentCircle: Omit<DrawCircle, 'type'> | null,
  currentRect: Omit<DrawRect, 'type'> | null,
  currentLine: Omit<DrawLine, 'type'> | null,
  currentArrow: Omit<DrawArrow, 'type'> | null
) => {
  // Draw current path being drawn
  if (currentPath) {
    drawPath(ctx, currentPath as DrawPath, scale);
  }

  // Draw current circle being drawn
  if (currentCircle) {
    drawCircle(
      ctx,
      currentCircle.x,
      currentCircle.y,
      currentCircle.radiusX,
      currentCircle.radiusY,
      scale,
      currentCircle.rotate,
      currentCircle.strokeStyle,
      currentCircle.lineWidth,
      currentCircle.fillStyle,
      currentCircle.strokePattern
    );
  }

  if (currentRect) {
    drawRectangle(
      ctx,
      currentRect.x,
      currentRect.y,
      currentRect.width,
      currentRect.height,
      scale,
      currentRect.rotate,
      currentRect.strokeStyle,
      currentRect.lineWidth,
      currentRect.fillStyle,
      currentRect.strokePattern
    );
  }

  if (currentLine) {
    drawLine(
      ctx,
      currentLine.x,
      currentLine.y,
      currentLine.endX,
      currentLine.endY,
      scale,
      currentLine.strokeStyle,
      currentLine.lineWidth,
      currentLine.strokePattern
    );
  }

  if (currentArrow) {
    drawArrow(
      ctx,
      currentArrow.x,
      currentArrow.y,
      currentArrow.endX,
      currentArrow.endY,
      scale,
      currentArrow.strokeStyle,
      currentArrow.lineWidth,
      currentArrow.fillStyle,
      currentArrow.strokePattern
    );
  }
};
