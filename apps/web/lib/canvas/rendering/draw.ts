import { getDepth } from '@/lib/data-structures/tree';
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

export const draw = (
  ctx: CanvasRenderingContext2D,
  points: DrawPoint[],
  scale: number
) => {
  ctx.strokeStyle = '#7A3EFF';
  ctx.lineWidth = 2 / scale;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  ctx.beginPath();
  ctx.moveTo(points[0]!.x, points[0]!.y);

  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i]!.x, points[i]!.y);
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
  const cellWidth = 50;
  const cellHeight = 40;

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
  const nodeRadius = 25;
  const levelHeight = 80;

  // find the the tree
  const dept = getDepth(root);
  const baseSpacing = 50;

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
