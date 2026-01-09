import {
  DrawArrow,
  DrawLine,
  DrawPoint,
  DrawRect
} from '@workspace/types/canvas';
import { drawArrow, drawCircle, drawLine, drawRectangle } from './draw';

export const drawElementsPreview = (
  ctx: CanvasRenderingContext2D,
  scale: number,
  currentPath: DrawPoint[],
  currentCircle: {
    center: DrawPoint;
    radius: number;
  } | null,
  currentRect: Omit<DrawRect, 'type'> | null,
  currentLine: Omit<DrawLine, 'type'> | null,
  currentArrow: Omit<DrawArrow, 'type'> | null
) => {
  // Draw current path being drawn
  if (currentPath.length > 0) {
    ctx.strokeStyle = '#7A3EFF';
    ctx.lineWidth = 2 / scale;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    ctx.moveTo(currentPath[0]!.x, currentPath[0]!.y);

    for (let i = 1; i < currentPath.length; i++) {
      ctx.lineTo(currentPath[i]!.x, currentPath[i]!.y);
    }
    ctx.stroke();
  }

  // Draw current circle being drawn
  if (currentCircle) {
    drawCircle(
      ctx,
      currentCircle.center.x,
      currentCircle.center.y,
      currentCircle.radius,
      scale
    );
  }

  if (currentRect) {
    drawRectangle(
      ctx,
      currentRect.x,
      currentRect.y,
      currentRect.width,
      currentRect.height,
      scale
    );
  }

  if (currentLine) {
    drawLine(
      ctx,
      currentLine.x,
      currentLine.y,
      currentLine.endX,
      currentLine.endY,
      scale
    );
  }

  if (currentArrow) {
    drawArrow(
      ctx,
      currentArrow.x,
      currentArrow.y,
      currentArrow.endX,
      currentArrow.endY,
      scale
    );
  }
};
