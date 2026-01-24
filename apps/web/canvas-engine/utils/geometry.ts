import {
  CanvasElement,
  Point,
  RectElement,
  TreeNode
} from '@algocanvas/types/canvas';
import { ARRAY_CONSTANTS } from '@/canvas-engine/data-structures/array';
import { LINKED_LIST_CONSTANTS } from '@/canvas-engine/data-structures/linked-list';
import { getDepth, TREE_CONSTANTS } from '@/canvas-engine/data-structures/tree';
import { measureTextWidth } from './text';

export type ElementBounds = {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
};

export const distanceFromPointToLineSegment = (
  point: Point,
  lineStart: Point,
  lineEnd: Point
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
  point: Point,
  points: Point[],
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
  point: Point,
  rect: RectElement,
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
  point: Point,
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

  const edges: [Point, Point][] = [
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
  point: Point,
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
  point: Point,
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
  point: Point,
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
  element: CanvasElement,
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

export const getElementBounds = (element: CanvasElement) => {
  if (element.type === 'draw') {
    const xs = element.points.map((p) => element.x + p.x);
    const ys = element.points.map((p) => element.y + p.y);

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
    const rx = Math.abs(element.radiusX);
    const ry = Math.abs(element.radiusY);

    return {
      minX: element.x - rx,
      minY: element.y - ry,
      maxX: element.x + rx,
      maxY: element.y + ry
    };
  } else if (element.type === 'line') {
    return {
      minX: Math.min(element.x, element.endX),
      minY: Math.min(element.y, element.endY),
      maxX: Math.max(element.x, element.endX),
      maxY: Math.max(element.y, element.endY)
    };
  } else if (element.type === 'arrow') {
    return {
      minX: Math.min(element.x, element.endX),
      maxX: Math.max(element.x, element.endX),
      minY: Math.min(element.y, element.endY),
      maxY: Math.max(element.y, element.endY)
    };
  } else if (element.type === 'array') {
    return {
      minX: Math.min(
        element.x,
        element.x + element.values.length * ARRAY_CONSTANTS.cellWidth
      ),
      maxX: Math.max(
        element.x,
        element.x + element.values.length * ARRAY_CONSTANTS.cellWidth
      ),
      minY: Math.min(element.y, element.y + ARRAY_CONSTANTS.cellHeight),
      maxY: Math.max(element.y, element.y + ARRAY_CONSTANTS.cellHeight + 20)
    };
  } else if (element.type === 'linked-list') {
    return {
      minX: Math.min(
        element.x,
        element.x +
          element.values.length *
            (LINKED_LIST_CONSTANTS.nodeWidth +
              LINKED_LIST_CONSTANTS.nodeSpacing +
              LINKED_LIST_CONSTANTS.arrowLength)
      ),
      maxX: Math.max(
        element.x,
        element.x +
          element.values.length *
            (LINKED_LIST_CONSTANTS.nodeWidth +
              LINKED_LIST_CONSTANTS.nodeSpacing +
              LINKED_LIST_CONSTANTS.arrowLength)
      ),
      minY: Math.min(element.y, element.y + LINKED_LIST_CONSTANTS.nodeHeight),
      maxY: Math.max(element.y, element.y + LINKED_LIST_CONSTANTS.nodeHeight)
    };
  } else if (element.type === 'binary-tree') {
    const depth = getDepth(element.root);

    const horizontalSpacing =
      TREE_CONSTANTS.baseSpacing * Math.pow(2, depth - 1);

    return {
      minX: Math.min(element.x, element.x - horizontalSpacing),
      maxX: Math.max(element.x, element.x + horizontalSpacing),
      minY: Math.min(element.y, element.y - TREE_CONSTANTS.nodeRadius),
      maxY: Math.max(
        element.y,
        element.y +
          (depth - 1) * TREE_CONSTANTS.levelHeight +
          TREE_CONSTANTS.nodeRadius
      )
    };
  } else if (element.type === 'text') {
    // Split text into lines for multiline support
    const lines = element.text.split('\n');
    const lineHeight = element.fontSize * 1.2;

    // Find the maximum width across all lines
    let maxWidth = 0;
    for (const line of lines) {
      const lineWidth = measureTextWidth(
        line,
        element.fontSize,
        element.fontFamily
      );
      if (lineWidth > maxWidth) {
        maxWidth = lineWidth;
      }
    }

    // Height = (n-1) line gaps + last line's font height
    const textHeight =
      lines.length === 1
        ? element.fontSize
        : (lines.length - 1) * lineHeight + element.fontSize;
    return {
      minX: element.x,
      minY: element.y,
      maxX: element.x + maxWidth,
      maxY: element.y + textHeight
    };
  }
  return null;
};

export const getCombinedBounds = (
  elements: CanvasElement[],
  selectedElementIds: string[],
  padding: number = 0
): ElementBounds | null => {
  if (selectedElementIds.length === 0) return null;

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const idx of selectedElementIds) {
    const element = elements.find((el) => el.id === idx);
    if (!element) continue;

    const bounds = getElementBounds(element);
    if (!bounds) continue;

    minX = Math.min(minX, bounds.minX);
    minY = Math.min(minY, bounds.minY);
    maxX = Math.max(maxX, bounds.maxX);
    maxY = Math.max(maxY, bounds.maxY);
  }

  if (minX === Infinity) return null;

  return {
    minX: minX - padding,
    minY: minY - padding,
    maxX: maxX + padding,
    maxY: maxY + padding
  };
};

export const isPointInBounds = (
  point: Point,
  bounds: ElementBounds
): boolean => {
  return (
    point.x >= bounds.minX &&
    point.x <= bounds.maxX &&
    point.y >= bounds.minY &&
    point.y <= bounds.maxY
  );
};

export const resizeElement = (
  element: CanvasElement,
  newBounds: ElementBounds
): void => {
  const { minX, minY, maxX, maxY } = newBounds;
  const newWidth = maxX - minX;
  const newHeight = maxY - minY;

  switch (element.type) {
    case 'rectangle':
      element.x = minX;
      element.y = minY;
      element.width = newWidth;
      element.height = newHeight;
      break;

    case 'circle':
      element.x = (minX + maxX) / 2;
      element.y = (minY + maxY) / 2;
      element.radiusX = newWidth / 2;
      element.radiusY = newHeight / 2;
      break;

    case 'line':
    case 'arrow': {
      // Calculate scale factors from original bounds
      const origWidth = Math.abs(element.endX - element.x) || 1;
      const origHeight = Math.abs(element.endY - element.y) || 1;
      const scaleX = newWidth / origWidth;
      const scaleY = newHeight / origHeight;

      // Determine original min positions
      const origMinX = Math.min(element.x, element.endX);
      const origMinY = Math.min(element.y, element.endY);

      // Scale relative to original min, then translate to new min
      const newX = minX + (element.x - origMinX) * scaleX;
      const newY = minY + (element.y - origMinY) * scaleY;
      const newEndX = minX + (element.endX - origMinX) * scaleX;
      const newEndY = minY + (element.endY - origMinY) * scaleY;

      element.x = newX;
      element.y = newY;
      element.endX = newEndX;
      element.endY = newEndY;
      break;
    }

    case 'draw': {
      // Get current bounds
      const xs = element.points.map((p) => element.x + p.x);
      const ys = element.points.map((p) => element.y + p.y);
      const origMinX = Math.min(...xs);
      const origMinY = Math.min(...ys);
      const origMaxX = Math.max(...xs);
      const origMaxY = Math.max(...ys);
      const origWidth = origMaxX - origMinX || 1;
      const origHeight = origMaxY - origMinY || 1;

      const scaleX = newWidth / origWidth;
      const scaleY = newHeight / origHeight;

      // Scale all points
      element.points = element.points.map((p) => {
        const absX = element.x + p.x;
        const absY = element.y + p.y;
        const newAbsX = minX + (absX - origMinX) * scaleX;
        const newAbsY = minY + (absY - origMinY) * scaleY;
        return {
          x: newAbsX - minX,
          y: newAbsY - minY
        };
      });
      element.x = minX;
      element.y = minY;
      break;
    }

    case 'text': {
      const oldBounds = getElementBounds(element);
      if (oldBounds) {
        const oldHeight = oldBounds.maxY - oldBounds.minY || 1;
        const newHeight = newBounds.maxY - newBounds.minY;
        const scaleFactor = newHeight / oldHeight;

        element.x = newBounds.minX;
        element.y = newBounds.minY;
        element.fontSize = Math.max(8, element.fontSize * scaleFactor); // Min font size of 8
      }
      break;
    }

    default:
      // Data structures (array, tree, linked-list) - just move, don't resize
      element.x = minX;
      element.y = minY;
      break;
  }
};

export const getElementProperty = <K extends PropertyKey>(
  element: CanvasElement,
  key: K
): string | number | undefined => {
  switch (key) {
    case 'strokeStyle':
      return 'strokeStyle' in element ? element.strokeStyle : undefined;
    case 'fillStyle':
      return 'fillStyle' in element ? element.fillStyle : undefined;
    case 'lineWidth':
      return 'lineWidth' in element ? element.lineWidth : undefined;
    case 'strokePattern':
      return 'strokePattern' in element ? element.strokePattern : undefined;
    case 'color':
      return 'color' in element ? element.color : undefined;
    case 'fontFamily':
      return 'fontFamily' in element ? element.fontFamily : undefined;
    case 'fontSize':
      return 'fontSize' in element ? element.fontSize : undefined;
    case 'rotate':
      return 'rotate' in element ? element.rotate : undefined;
    case 'lineCap':
      return 'lineCap' in element ? element.lineCap : undefined;
    case 'lineJoin':
      return 'lineJoin' in element ? element.lineJoin : undefined;
    default:
      return undefined;
  }
};
