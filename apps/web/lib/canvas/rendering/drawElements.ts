import { DrawElements } from '@workspace/types/canvas';
import { draw, drawArrow, drawCircle, drawLine, drawRectangle } from './draw';

export const drawElements = (
  ctx: CanvasRenderingContext2D,
  elements: DrawElements[],
  scale: number
) => {
  elements.forEach((element) => {
    if (element.type === 'draw') {
      if (element.points.length < 2) return;

      draw(ctx, element.points, scale);
    } else if (element.type === 'circle') {
      drawCircle(ctx, element.centerX, element.centerY, element.radius, scale);
    } else if (element.type === 'rectangle') {
      drawRectangle(
        ctx,
        element.x,
        element.y,
        element.width,
        element.height,
        scale
      );
    } else if (element.type === 'line') {
      drawLine(
        ctx,
        element.startX,
        element.startY,
        element.endX,
        element.endY,
        scale
      );
    } else if (element.type === 'arrow') {
      drawArrow(
        ctx,
        element.startX,
        element.startY,
        element.endX,
        element.endY,
        scale
      );
    }
  });
};
