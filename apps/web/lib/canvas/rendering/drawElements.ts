import { DrawElements } from '@workspace/types/canvas';
import {
  draw,
  drawArray,
  drawArrow,
  drawBinaryTree,
  drawCircle,
  drawLine,
  drawLinkedList,
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
      drawCircle(ctx, element.x, element.y, element.radius, scale);
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
      drawLine(ctx, element.x, element.y, element.endX, element.endY, scale);
    } else if (element.type === 'arrow') {
      drawArrow(ctx, element.x, element.y, element.endX, element.endY, scale);
    } else if (element.type === 'array') {
      drawArray(ctx, element.x, element.y, element.value, scale);
    } else if (element.type === 'binary-tree') {
      drawBinaryTree(ctx, element.root, element.x, element.y, scale);
    } else if (element.type === 'linked-list') {
      drawLinkedList(ctx, element.x, element.y, element.values, scale);
    }
  });
};
