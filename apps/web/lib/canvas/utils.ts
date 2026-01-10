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
