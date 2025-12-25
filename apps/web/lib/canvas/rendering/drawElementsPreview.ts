import {
  DrawArrow,
  DrawLine,
  DrawPoint,
  DrawRect
} from '@workspace/types/canvas';
import { drawArrow } from './draw';

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
    ctx.strokeStyle = '#7A3EFF';
    ctx.lineWidth = 2 / scale;

    ctx.beginPath();
    ctx.arc(
      currentCircle.center.x,
      currentCircle.center.y,
      currentCircle.radius,
      0,
      Math.PI * 2
    );
    ctx.stroke();
  }

  if (currentRect) {
    ctx.strokeStyle = '#7A3EFF';
    ctx.lineWidth = 2 / scale;

    ctx.beginPath();
    ctx.rect(
      currentRect.x,
      currentRect.y,
      currentRect.width,
      currentRect.height
    );
    ctx.stroke();
  }

  if (currentLine) {
    ctx.strokeStyle = '#7A3EFF';
    ctx.lineWidth = 2 / scale;

    ctx.beginPath();
    ctx.moveTo(currentLine.startX, currentLine.startY);
    ctx.lineTo(currentLine.endX, currentLine.endY);

    ctx.stroke();
  }

  if (currentArrow) {
    drawArrow(
      ctx,
      currentArrow.startX,
      currentArrow.startY,
      currentArrow.endX,
      currentArrow.endY,
      scale
    );
  }
};
