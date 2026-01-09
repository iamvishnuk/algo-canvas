import { DrawElements, DrawPoint } from '@workspace/types/canvas';
import {
  distanceFromPointToLineSegment,
  isCursorOnArray,
  isCursorOnLinkedList,
  isCursorOnTree,
  isPointNearPath,
  isPointNearRectangle
} from './geometry';

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
      const distanceFromCenter = Math.hypot(
        worldPos.x - element.x,
        worldPos.y - element.y
      );
      return Math.abs(distanceFromCenter - element.radius) <= hitTolerance;
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
