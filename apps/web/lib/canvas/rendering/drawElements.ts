import { DrawElements } from '@workspace/types/canvas';
import {
  draw,
  drawArray,
  drawArrow,
  drawBinaryTree,
  drawCircle,
  drawLine,
  drawRectangle
} from './draw';

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
    } else if (element.type === 'array') {
      drawArray(ctx, element.x, element.y, element.value, scale);
    } else if (element.type === 'binary-tree') {
      drawBinaryTree(ctx, element.root, element.x, element.y, scale);
    }
  });
};
