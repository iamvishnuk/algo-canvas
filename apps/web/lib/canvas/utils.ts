import { DrawElements, DrawPoint } from '@workspace/types/canvas';

export const getElementBounds = (element: DrawElements) => {
  if (element.type === 'draw') {
    const xs = element.points.map((p: DrawPoint) => p.x);
    const ys = element.points.map((p: DrawPoint) => p.y);
    return {
      minX: Math.min(...xs),
      minY: Math.min(...ys),
      maxX: Math.max(...xs),
      maxY: Math.max(...ys)
    };
  } else if (element.type === 'rectangle') {
    return {
      minX: Math.min(element.x, element.x + element.width),
      minY: Math.min(element.y, element.y + element.height),
      maxX: Math.max(element.x, element.x + element.width),
      maxY: Math.max(element.y, element.y + element.height)
    };
  } else if (element.type === 'circle') {
    return {
      minX: element.centerX - element.radius,
      minY: element.centerY - element.radius,
      maxX: element.centerX + element.radius,
      maxY: element.centerY + element.radius
    };
  } else if (element.type === 'line') {
    return {
      minX: Math.min(element.startX, element.endX),
      minY: Math.min(element.startY, element.endY),
      maxX: Math.max(element.startX, element.endX),
      maxY: Math.max(element.startY, element.endY)
    };
  }
  return null;
};
