import { ARRAY_CONSTANTS } from '@/lib/data-structures/array';
import { LINKED_LIST_CONSTANTS } from '@/lib/data-structures/linked-list';
import { getDepth, TREE_CONSTANTS } from '@/lib/data-structures/tree';
import { DrawPoint, TreeNode } from '@workspace/types/canvas';

export const drawCircle = (
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  radius: number,
  scale: number
) => {
  ctx.strokeStyle = '#7A3EFF';
  ctx.lineWidth = 2 / scale;

  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.stroke();
};

export const drawArrow = (
  ctx: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  scale: number
) => {
  ctx.strokeStyle = '#7A3EFF';
  ctx.lineWidth = 2 / scale;

  const angle = Math.atan2(endY - startY, endX - startX);

  // Line
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);
  ctx.stroke();

  // Arrowhead
  ctx.beginPath();
  ctx.moveTo(endX, endY);
  ctx.lineTo(
    endX - 10 * Math.cos(angle - Math.PI / 6),
    endY - 10 * Math.sin(angle - Math.PI / 6)
  );
  ctx.lineTo(
    endX - 10 * Math.cos(angle + Math.PI / 6),
    endY - 10 * Math.sin(angle + Math.PI / 6)
  );
  ctx.closePath();
  ctx.fillStyle = '#7A3EFF';
  ctx.fill();
};

export const drawRectangle = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  scale: number
) => {
  ctx.strokeStyle = '#7A3EFF';
  ctx.lineWidth = 2 / scale;

  ctx.beginPath();
  ctx.rect(x, y, width, height);
  ctx.stroke();
};

export const drawPath = (
  ctx: CanvasRenderingContext2D,
  points: DrawPoint[],
  x: number,
  y: number,
  scale: number
) => {
  if (points.length === 0) return;

  ctx.strokeStyle = '#7A3EFF';
  ctx.lineWidth = 2 / scale;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  ctx.beginPath();
  ctx.moveTo(x + points[0]!.x, y + points[0]!.y);

  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(x + points[i]!.x, y + points[i]!.y);
  }

  ctx.stroke();
};

export const drawLine = (
  ctx: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  scale: number
) => {
  ctx.strokeStyle = '#7A3EFF';
  ctx.lineWidth = 2 / scale;

  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);

  ctx.stroke();
};

export const drawArray = (
  ctx: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  values: string[],
  scale: number
) => {
  const cellWidth = ARRAY_CONSTANTS.cellWidth;
  const cellHeight = ARRAY_CONSTANTS.cellHeight;

  values.forEach((value, index) => {
    const x = startX + index * cellWidth;
    const y = startY;

    ctx.strokeStyle = '#3b82f6';
    ctx.fillStyle = '#1e40af';
    ctx.lineWidth = 2 / scale;
    ctx.fillRect(x, y, cellWidth, cellHeight);
    ctx.strokeRect(x, y, cellWidth, cellHeight);

    // Array value
    ctx.fillStyle = '#ffffff';
    ctx.font = `${16 / scale}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(value, x + cellWidth / 2, y + cellHeight / 2);

    // Array index
    ctx.fillStyle = '#9ca3af';
    ctx.font = `${12 / scale}px Arial`;
    ctx.fillText(
      index.toString(),
      x + cellWidth / 2,
      y + cellHeight + 15 / scale
    );
  });
};

export const drawNode = (
  ctx: CanvasRenderingContext2D,
  node: TreeNode | undefined,
  x: number,
  y: number,
  horizontalOffset: number,
  levelHeight: number,
  nodeRadius: number,
  scale: number
) => {
  if (!node) return;

  if (node.left) {
    const childX = x - horizontalOffset;
    const childY = y + levelHeight;
    ctx.strokeStyle = '#6b7280';
    ctx.lineWidth = 2 / scale;
    ctx.beginPath();
    ctx.moveTo(x, y + nodeRadius);
    ctx.lineTo(childX, childY - nodeRadius);
    ctx.stroke();
    drawNode(
      ctx,
      node.left,
      childX,
      childY,
      horizontalOffset / 2,
      levelHeight,
      nodeRadius,
      scale
    );
  }

  if (node.right) {
    const childX = x + horizontalOffset;
    const childY = y + levelHeight;
    ctx.strokeStyle = '#6b7280';
    ctx.lineWidth = 2 / scale;
    ctx.beginPath();
    ctx.moveTo(x, y + nodeRadius);
    ctx.lineTo(childX, childY - nodeRadius);
    ctx.stroke();
    drawNode(
      ctx,
      node.right,
      childX,
      childY,
      horizontalOffset / 2,
      levelHeight,
      nodeRadius,
      scale
    );
  }

  // Draw node circle
  ctx.strokeStyle = '#10b981';
  ctx.fillStyle = '#059669';
  ctx.lineWidth = 2 / scale;
  ctx.beginPath();
  ctx.arc(x, y, nodeRadius, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Draw node value
  ctx.fillStyle = '#ffffff';
  ctx.font = `${16 / scale}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(node.value, x, y);
};

export const drawBinaryTree = (
  ctx: CanvasRenderingContext2D,
  root: TreeNode,
  startX: number,
  startY: number,
  scale: number
) => {
  const nodeRadius = TREE_CONSTANTS.nodeRadius;
  const levelHeight = TREE_CONSTANTS.levelHeight;

  // find the the tree
  const dept = getDepth(root);
  const baseSpacing = TREE_CONSTANTS.baseSpacing;

  const horizontalSpacing = baseSpacing * Math.pow(2, dept - 1);

  drawNode(
    ctx,
    root,
    startX,
    startY,
    horizontalSpacing / 2,
    levelHeight,
    nodeRadius,
    scale
  );
};

export const drawLinkedList = (
  ctx: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  values: string[],
  scale: number
) => {
  const nodeWidth = LINKED_LIST_CONSTANTS.nodeWidth;
  const nodeHeight = LINKED_LIST_CONSTANTS.nodeHeight;
  const spacing = LINKED_LIST_CONSTANTS.nodeSpacing;
  const arrowLength = LINKED_LIST_CONSTANTS.arrowLength;

  values.forEach((value, index) => {
    const x = startX + index * (nodeWidth + spacing + arrowLength);
    const y = startY;

    // Draw node box
    ctx.strokeStyle = '#f59e0b';
    ctx.fillStyle = '#d97706';
    ctx.lineWidth = 2 / scale;
    ctx.fillRect(x, y, nodeWidth, nodeHeight);
    ctx.strokeRect(x, y, nodeWidth, nodeHeight);

    // Draw value text
    ctx.fillStyle = '#ffffff';
    ctx.font = `${14 / scale}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(value, x + nodeWidth / 2, y + nodeHeight / 2);

    // Draw arrow to next node (if not last node)
    if (index < values.length - 1) {
      ctx.strokeStyle = '#9ca3af';
      ctx.fillStyle = '#9ca3af';
      ctx.lineWidth = 2 / scale;

      const arrowStartX = x + nodeWidth;
      const arrowStartY = y + nodeHeight / 2;
      const arrowEndX = arrowStartX + arrowLength;
      const arrowEndY = arrowStartY;

      // Draw arrow line
      ctx.beginPath();
      ctx.moveTo(arrowStartX, arrowStartY);
      ctx.lineTo(arrowEndX, arrowEndY);
      ctx.stroke();

      // Draw arrow head
      const headSize = 8 / scale;
      ctx.beginPath();
      ctx.moveTo(arrowEndX, arrowEndY);
      ctx.lineTo(arrowEndX - headSize, arrowEndY - headSize / 2);
      ctx.lineTo(arrowEndX - headSize, arrowEndY + headSize / 2);
      ctx.closePath();
      ctx.fill();
    } else {
      // Draw null indicator for last node
      ctx.fillStyle = '#9ca3af';
      ctx.font = `${12 / scale}px Arial`;
      ctx.textAlign = 'left';
      ctx.fillText('null', x + nodeWidth + 10, y + nodeHeight / 2);
    }
  });
};
