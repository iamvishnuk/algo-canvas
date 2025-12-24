import { DrawElements, DrawPoint, DrawRect } from '@workspace/types/canvas';
import { getElementBounds } from './utils';

export const distanceFromPointToLineSegment = (
  point: DrawPoint,
  lineStart: DrawPoint,
  lineEnd: DrawPoint
): number => {
  const lineDx = lineEnd.x - lineStart.x;
  const lineDy = lineEnd.y - lineStart.y;

  // If lineStart and lineEnd are the same point
  if (lineDx === 0 && lineDy === 0) {
    return Math.hypot(point.x - lineStart.x, point.y - lineStart.y);
  }

  // Project the point onto the line (normalized 0 → 1)
  const projection =
    ((point.x - lineStart.x) * lineDx + (point.y - lineStart.y) * lineDy) /
    (lineDx * lineDx + lineDy * lineDy);

  // Clamp projection to stay within the line segment
  const clampedProjection = Math.max(0, Math.min(1, projection));

  // Closest point on the line segment
  const closestPointX = lineStart.x + clampedProjection * lineDx;
  const closestPointY = lineStart.y + clampedProjection * lineDy;

  // Distance from mouse point to the closest point
  return Math.hypot(point.x - closestPointX, point.y - closestPointY);
};

export const isPointNearPath = (
  point: DrawPoint,
  path: DrawPoint[],
  tolerance: number
): boolean => {
  for (let i = 0; i < path.length - 1; i++) {
    const currentPoint = path[i];
    const nextPoint = path[i + 1];

    if (
      currentPoint &&
      nextPoint &&
      distanceFromPointToLineSegment(point, currentPoint, nextPoint) <=
        tolerance
    ) {
      return true;
    }
  }
  return false;
};

export const isPointNearRectangle = (
  point: DrawPoint,
  rect: DrawRect,
  tolerance: number
): boolean => {
  const { x, y, width, height } = rect;
  const edges = [
    [
      { x, y },
      { x: x + width, y }
    ],
    [
      { x: x + width, y },
      { x: x + width, y: y + height }
    ],
    [
      { x: x + width, y: y + height },
      { x, y: y + height }
    ],
    [
      { x, y: y + height },
      { x, y }
    ]
  ];

  return edges.some(([start, end]) => {
    if (start && end) {
      return distanceFromPointToLineSegment(point, start, end) <= tolerance;
    }
  });
};

export const isElementInSelectionArea = (
  element: DrawElements,
  selectionArea: { minX: number; minY: number; maxX: number; maxY: number }
) => {
  const bounds = getElementBounds(element);
  if (!bounds) return false;

  // Check if element bounds are completely inside selection area
  return (
    bounds.minX >= selectionArea.minX &&
    bounds.maxX <= selectionArea.maxX &&
    bounds.minY >= selectionArea.minY &&
    bounds.maxY <= selectionArea.maxY
  );
};
