import { DrawElements, ViewState } from '@workspace/types/canvas';
import { getElementBounds } from '../utils';

export const drawSelectionBox = (
  ctx: CanvasRenderingContext2D,
  selectedElementIndex: number | null,
  elements: DrawElements[],
  view: ViewState
) => {
  if (selectedElementIndex === null) return;

  const element = elements[selectedElementIndex];
  if (!element) return;

  const bounds = getElementBounds(element);
  if (!bounds) return;

  const padding = 10 / view.scale;
  const { minX, minY, maxX, maxY } = bounds;

  ctx.strokeStyle = '#3b82f6';
  ctx.lineWidth = 2 / view.scale;
  ctx.setLineDash([5 / view.scale, 5 / view.scale]);
  ctx.strokeRect(
    minX - padding,
    minY - padding,
    maxX - minX + padding * 2,
    maxY - minY + padding * 2
  );
  ctx.setLineDash([]);

  // Draw corner handles
  const handleSize = 8 / view.scale;
  ctx.fillStyle = '#3b82f6';
  const corners = [
    { x: minX - padding, y: minY - padding },
    { x: maxX + padding, y: minY - padding },
    { x: minX - padding, y: maxY + padding },
    { x: maxX + padding, y: maxY + padding }
  ];

  corners.forEach((corner) => {
    ctx.fillRect(
      corner.x - handleSize / 2,
      corner.y - handleSize / 2,
      handleSize,
      handleSize
    );
  });
};
