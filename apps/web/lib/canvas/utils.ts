import { DrawElements, DrawPoint } from '@workspace/types/canvas';
import { ARRAY_CONSTANTS } from '../data-structures/array';
import { LINKED_LIST_CONSTANTS } from '../data-structures/linked-list';
import { getDepth, TREE_CONSTANTS } from '../data-structures/tree';

export const getElementBounds = (element: DrawElements) => {
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
        element.x + element.value.length * ARRAY_CONSTANTS.cellWidth
      ),
      maxX: Math.max(
        element.x,
        element.x + element.value.length * ARRAY_CONSTANTS.cellWidth
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
  }
  return null;
};

export type ElementBounds = {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
};

/**
 * Get combined bounds of multiple elements
 */
export const getCombinedBounds = (
  elements: DrawElements[],
  indices: number[],
  padding: number = 0
): ElementBounds | null => {
  if (indices.length === 0) return null;

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const idx of indices) {
    const element = elements[idx];
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

/**
 * Check if a point is inside bounds
 */
export const isPointInBounds = (
  point: DrawPoint,
  bounds: ElementBounds
): boolean => {
  return (
    point.x >= bounds.minX &&
    point.x <= bounds.maxX &&
    point.y >= bounds.minY &&
    point.y <= bounds.maxY
  );
};

/**
 * Resize an element to fit new bounds
 * Mutates the element in place
 */
export const resizeElement = (
  element: DrawElements,
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

    default:
      // Data structures (array, tree, linked-list) - just move, don't resize
      element.x = minX;
      element.y = minY;
      break;
  }
};
