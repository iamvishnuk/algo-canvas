import { CanvasElement } from '@algocanvas/types/canvas';
import {
  drawArray,
  drawArrow,
  drawBinaryTree,
  drawCircle,
  drawLine,
  drawLinkedList,
  drawPath,
  drawRectangle,
  drawText
} from '../rendering/draw';

export const drawElements = (
  ctx: CanvasRenderingContext2D,
  elements: CanvasElement[],
  scale: number,
  skipIndex?: number | null
) => {
  elements.forEach((element, index) => {
    // Skip the element being edited
    if (skipIndex !== undefined && skipIndex !== null && index === skipIndex) {
      return;
    }
    if (element.type === 'draw') {
      if (element.points.length < 2) return;

      drawPath(ctx, element, scale);
    } else if (element.type === 'circle') {
      drawCircle(
        ctx,
        element.x,
        element.y,
        element.radiusX,
        element.radiusY,
        scale,
        element.rotate,
        element.strokeStyle,
        element.lineWidth,
        element.fillStyle,
        element.strokePattern
      );
    } else if (element.type === 'rectangle') {
      drawRectangle(
        ctx,
        element.x,
        element.y,
        element.width,
        element.height,
        scale,
        element.rotate,
        element.strokeStyle,
        element.lineWidth,
        element.fillStyle,
        element.strokePattern
      );
    } else if (element.type === 'line') {
      drawLine(
        ctx,
        element.x,
        element.y,
        element.endX,
        element.endY,
        scale,
        element.strokeStyle,
        element.lineWidth,
        element.strokePattern
      );
    } else if (element.type === 'arrow') {
      drawArrow(
        ctx,
        element.x,
        element.y,
        element.endX,
        element.endY,
        scale,
        element.strokeStyle,
        element.lineWidth,
        element.fillStyle,
        element.strokePattern
      );
    } else if (element.type === 'array') {
      drawArray(ctx, element.x, element.y, element.values, scale);
    } else if (element.type === 'binary-tree') {
      drawBinaryTree(ctx, element.root, element.x, element.y, scale);
    } else if (element.type === 'linked-list') {
      drawLinkedList(ctx, element.x, element.y, element.values, scale);
    } else if (element.type === 'text') {
      drawText(ctx, element);
    }
  });
};
