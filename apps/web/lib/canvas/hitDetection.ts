import { DrawElements, DrawPoint, ViewState } from '@workspace/types/canvas';
import {
  distanceFromPointToLineSegment,
  isCursorOnArray,
  isCursorOnLinkedList,
  isCursorOnTree,
  isPointNearPath,
  isPointNearRectangle
} from './geometry';
import { getElementBounds } from './utils';
import { rotatePoint } from './rendering/drawSelectionBox';

export type ResizeHandle =
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'
  | null;

/**
 * Get the resize handle at the given world position for a selected element
 */
export function getResizeHandle(
  worldPos: DrawPoint,
  element: DrawElements,
  view: ViewState
): ResizeHandle {
  const bounds = getElementBounds(element);
  if (!bounds) return null;

  const { minX, minY, maxX, maxY } = bounds;
  const padding = 10 / view.scale;
  const handleSize = 8 / view.scale;
  const hitTolerance = handleSize;

  const centerX = (minX + maxX) / 2;
  const centerY = (minY + maxY) / 2;

  const isRotatable = element.type === 'rectangle' || element.type === 'text';
  const rotation = isRotatable ? (element.rotate ?? 0) : 0;

  // Define corner handle positions (with padding)
  const corners: { handle: ResizeHandle; x: number; y: number }[] = [
    { handle: 'top-left', x: minX - padding, y: minY - padding },
    { handle: 'top-right', x: maxX + padding, y: minY - padding },
    { handle: 'bottom-left', x: minX - padding, y: maxY + padding },
    { handle: 'bottom-right', x: maxX + padding, y: maxY + padding }
  ];

  // Transform cursor to element's local space if rotated
  let localPos = worldPos;
  if (rotation !== 0) {
    // Inverse rotation: rotate cursor position back
    localPos = rotatePoint(worldPos.x, worldPos.y, centerX, centerY, -rotation);
  }

  for (const corner of corners) {
    const dx = localPos.x - corner.x;
    const dy = localPos.y - corner.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance <= hitTolerance) {
      return corner.handle;
    }
  }

  return null;
}

/**
 * Check if a point hits a specific canvas element
 */
export function isElementHit(
  worldPos: DrawPoint,
  element: DrawElements,
  hitTolerance: number
): boolean {
  switch (element.type) {
    case 'draw':
      return isPointNearPath(
        worldPos,
        element.points,
        hitTolerance,
        element.x,
        element.y
      );

    case 'rectangle':
      return isPointNearRectangle(worldPos, element, hitTolerance);

    case 'circle': {
      const dx = worldPos.x - element.x;
      const dy = worldPos.y - element.y;

      const rx = Math.abs(element.radiusX);
      const ry = Math.abs(element.radiusY);

      if (rx === 0 || ry === 0) return false;

      // Normalize point to ellipse space
      const normalized = (dx * dx) / (rx * rx) + (dy * dy) / (ry * ry);

      // Convert hitTolerance to normalized space
      const tolerance = hitTolerance / Math.max(rx, ry);

      // Near ellipse border (≈ 1)
      return Math.abs(normalized - 1) <= tolerance;
    }

    case 'line':
    case 'arrow': {
      const distance = distanceFromPointToLineSegment(
        worldPos,
        { x: element.x, y: element.y },
        { x: element.endX, y: element.endY }
      );
      return distance <= hitTolerance;
    }

    case 'array':
      return isCursorOnArray(
        worldPos,
        element.x,
        element.y,
        element.value.length,
        hitTolerance
      );

    case 'linked-list':
      return isCursorOnLinkedList(
        worldPos,
        element.x,
        element.y,
        element.values.length
      );

    case 'binary-tree':
      return isCursorOnTree(
        worldPos,
        element.x,
        element.y,
        element.root,
        hitTolerance
      );

    case 'text': {
      // Approximate text bounding box (same calculation as getElementBounds)
      const approxWidth = element.text.length * element.fontSize * 0.6;
      const approxHeight = element.fontSize;

      return (
        worldPos.x >= element.x - hitTolerance &&
        worldPos.x <= element.x + approxWidth + hitTolerance &&
        worldPos.y >= element.y - hitTolerance &&
        worldPos.y <= element.y + approxHeight + hitTolerance
      );
    }

    default:
      return false;
  }
}

/**
 * Find the element at a given position (top-most element first)
 * Returns the index of the element or null if no element is found
 */
export function findElementAtPosition(
  worldPos: DrawPoint,
  elements: DrawElements[],
  hitTolerance: number
): number | null {
  // Check elements in reverse order (top to bottom)
  for (let i = elements.length - 1; i >= 0; i--) {
    const element = elements[i];
    if (element && isElementHit(worldPos, element, hitTolerance)) {
      return i;
    }
  }
  return null;
}
