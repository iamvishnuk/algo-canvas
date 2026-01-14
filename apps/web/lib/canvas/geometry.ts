import {
  DrawElements,
  DrawPoint,
  DrawRect,
  TreeNode
} from '@algocanvas/types/canvas';
import { getElementBounds } from './utils';
import { ARRAY_CONSTANTS } from '../data-structures/array';
import { LINKED_LIST_CONSTANTS } from '../data-structures/linked-list';
import { getDepth, TREE_CONSTANTS } from '../data-structures/tree';

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
  points: DrawPoint[],
  tolerance: number,
  offsetX: number,
  offsetY: number
) => {
  for (let i = 0; i < points.length - 1; i++) {
    const p1 = {
      x: offsetX + points[i]!.x,
      y: offsetY + points[i]!.y
    };
    const p2 = {
      x: offsetX + points[i + 1]!.x,
      y: offsetY + points[i + 1]!.y
    };

    const d = distanceFromPointToLineSegment(point, p1, p2);
    if (d <= tolerance) return true;
  }
  return false;
};

export const isPointNearRectangle = (
  point: DrawPoint,
  rect: DrawRect,
  tolerance: number
): boolean => {
  const angle = rect.rotate ?? 0;

  const cx = rect.x + rect.width / 2;
  const cy = rect.y + rect.height / 2;

  // 🔁 Unrotate the point
  const dx = point.x - cx;
  const dy = point.y - cy;

  const unrotated = {
    x: cx + dx * Math.cos(-angle) - dy * Math.sin(-angle),
    y: cy + dx * Math.sin(-angle) + dy * Math.cos(-angle)
  };

  const edges = [
    [
      { x: rect.x, y: rect.y },
      { x: rect.x + rect.width, y: rect.y }
    ],
    [
      { x: rect.x + rect.width, y: rect.y },
      { x: rect.x + rect.width, y: rect.y + rect.height }
    ],
    [
      { x: rect.x + rect.width, y: rect.y + rect.height },
      { x: rect.x, y: rect.y + rect.height }
    ],
    [
      { x: rect.x, y: rect.y + rect.height },
      { x: rect.x, y: rect.y }
    ]
  ];

  return edges.some(
    ([start, end]) =>
      distanceFromPointToLineSegment(unrotated, start!, end!) <= tolerance
  );
};

export const isCursorOnArray = (
  point: DrawPoint,
  x: number,
  y: number,
  length: number,
  tolerance: number
): boolean => {
  const width = length * ARRAY_CONSTANTS.cellWidth;
  const height = ARRAY_CONSTANTS.cellHeight;

  const left = x;
  const right = x + width;
  const top = y;
  const bottom = y + height;

  const edges: [DrawPoint, DrawPoint][] = [
    [
      { x: left, y: top },
      { x: right, y: top }
    ], // top
    [
      { x: right, y: top },
      { x: right, y: bottom }
    ], // right
    [
      { x: right, y: bottom },
      { x: left, y: bottom }
    ], // bottom
    [
      { x: left, y: bottom },
      { x: left, y: top }
    ] // left
  ];

  const isInside =
    point.x >= left && point.x <= right && point.y >= top && point.y <= bottom;

  return (
    isInside ||
    edges.some(
      ([s, e]) => distanceFromPointToLineSegment(point, s, e) <= tolerance
    )
  );
};

export const isCursorOnLinkedList = (
  point: DrawPoint,
  x: number,
  y: number,
  length: number
): boolean => {
  const width =
    length *
    (LINKED_LIST_CONSTANTS.nodeWidth +
      LINKED_LIST_CONSTANTS.nodeSpacing +
      LINKED_LIST_CONSTANTS.arrowLength);
  const height = LINKED_LIST_CONSTANTS.nodeHeight;

  const left = x;
  const right = x + width;
  const top = y;
  const bottom = y + height;

  return (
    point.x >= left && point.x <= right && point.y >= top && point.y <= bottom
  );
};

export const cursorOnTree = (
  point: DrawPoint,
  x: number,
  y: number,
  root: TreeNode,
  tolerance: number,
  horizontalOffset: number
): boolean => {
  if (!root) return false;

  const dx = point.x - x;
  const dy = point.y - y;
  const distanceFromCenter = Math.sqrt(dx * dx + dy * dy);

  if (distanceFromCenter <= TREE_CONSTANTS.nodeRadius) {
    return true;
  }

  if (root.left) {
    const distance = distanceFromPointToLineSegment(
      point,
      {
        x: x,
        y: y + TREE_CONSTANTS.nodeRadius
      },
      {
        x: x - horizontalOffset,
        y: y + TREE_CONSTANTS.levelHeight - TREE_CONSTANTS.nodeRadius
      }
    );

    if (distance <= tolerance) {
      return true;
    }

    if (
      cursorOnTree(
        point,
        x - horizontalOffset,
        y + TREE_CONSTANTS.levelHeight,
        root.left,
        tolerance,
        horizontalOffset / 2
      )
    ) {
      return true;
    }
  }
  if (root.right) {
    const distance = distanceFromPointToLineSegment(
      point,
      {
        x: x,
        y: y + TREE_CONSTANTS.nodeRadius
      },
      {
        x: x + horizontalOffset,
        y: y + TREE_CONSTANTS.levelHeight - TREE_CONSTANTS.nodeRadius
      }
    );

    if (distance <= tolerance) {
      return true;
    }

    if (
      cursorOnTree(
        point,
        x + horizontalOffset,
        y + TREE_CONSTANTS.levelHeight,
        root.right,
        tolerance,
        horizontalOffset / 2
      )
    ) {
      return true;
    }
  }

  return false;
};

export const isCursorOnTree = (
  point: DrawPoint,
  x: number,
  y: number,
  root: TreeNode,
  tolerance: number
): boolean => {
  if (!root) return false;

  const depth = getDepth(root);

  const horizontalSpacing = TREE_CONSTANTS.baseSpacing * Math.pow(2, depth - 1);

  return cursorOnTree(point, x, y, root, tolerance, horizontalSpacing / 2);
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
