import { DrawElements, DrawPoint, ViewState } from '@workspace/types/canvas';
import { getElementBounds } from '../utils';

export const rotatePoint = (
  x: number,
  y: number,
  cx: number,
  cy: number,
  angle: number
) => {
  const dx = x - cx;
  const dy = y - cy;

  return {
    x: cx + dx * Math.cos(angle) - dy * Math.sin(angle),
    y: cy + dx * Math.sin(angle) + dy * Math.cos(angle)
  };
};

export const drawSelectionBox = (
  ctx: CanvasRenderingContext2D,
  selectedElementIndex: number | null,
  elements: DrawElements[],
  view: ViewState,
  selectedElementsIndices: number[],
  isAreaSelecting: boolean,
  areaSelectionStart: DrawPoint | null,
  areaSelectionEnd: DrawPoint | null
) => {
  if (selectedElementIndex !== null) {
    const element = elements[selectedElementIndex];
    if (!element) return;

    const bounds = getElementBounds(element);
    if (!bounds) return;

    const { minX, minY, maxX, maxY } = bounds;
    const padding = 10 / view.scale;
    const handleSize = 8 / view.scale;
    const rotateOffset = 20 / view.scale;
    const rotateRadius = 6 / view.scale;

    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;

    const isRotated = element.type === 'rectangle' && element.rotate !== 0;

    ctx.save();

    if (isRotated) {
      ctx.translate(centerX, centerY);
      ctx.rotate(element.rotate);
      ctx.translate(-centerX, -centerY);
    }

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

    // 🔹 CORNER HANDLES
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

    ctx.restore();

    // 🔹 ROTATION HANDLE (NOT ROTATED WITH CANVAS)
    const rawRotatePoint = {
      x: centerX,
      y: minY - padding - rotateOffset
    };

    const rotatePointFinal = isRotated
      ? rotatePoint(
          rawRotatePoint.x,
          rawRotatePoint.y,
          centerX,
          centerY,
          element.rotate
        )
      : rawRotatePoint;

    ctx.beginPath();
    ctx.arc(
      rotatePointFinal.x,
      rotatePointFinal.y,
      rotateRadius,
      0,
      Math.PI * 2
    );
    ctx.fillStyle = '#3b82f6';
    ctx.fill();
  }

  // Draw multiple elements selection
  if (selectedElementsIndices.length > 0) {
    // Draw individual selection boxes for each element
    selectedElementsIndices.forEach((index) => {
      const element = elements[index];
      if (!element) return;

      const bounds = getElementBounds(element);
      if (!bounds) return;

      const padding = 5 / view.scale;
      const { minX, minY, maxX, maxY } = bounds;

      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 2 / view.scale;
      // ctx.setLineDash([5 / view.scale, 5 / view.scale]);
      ctx.strokeRect(
        minX - padding,
        minY - padding,
        maxX - minX + padding * 2,
        maxY - minY + padding * 2
      );
      ctx.setLineDash([]);
    });

    // Draw overall bounding box around all selected elements
    let overallMinX = Infinity;
    let overallMinY = Infinity;
    let overallMaxX = -Infinity;
    let overallMaxY = -Infinity;

    selectedElementsIndices.forEach((index) => {
      const element = elements[index];
      if (!element) return;

      const bounds = getElementBounds(element);
      if (!bounds) return;

      overallMinX = Math.min(overallMinX, bounds.minX);
      overallMinY = Math.min(overallMinY, bounds.minY);
      overallMaxX = Math.max(overallMaxX, bounds.maxX);
      overallMaxY = Math.max(overallMaxY, bounds.maxY);
    });

    if (overallMinX !== Infinity) {
      const padding = 25 / view.scale;

      // Draw overall bounding box with different style
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 3 / view.scale;
      ctx.setLineDash([5 / view.scale, 5 / view.scale]);
      ctx.strokeRect(
        overallMinX - padding,
        overallMinY - padding,
        overallMaxX - overallMinX + padding * 2,
        overallMaxY - overallMinY + padding * 2
      );

      // Draw larger corner handles for the overall box
      const handleSize = 10 / view.scale;
      ctx.fillStyle = '#3b82f6';
      const corners = [
        { x: overallMinX - padding, y: overallMinY - padding },
        { x: overallMaxX + padding, y: overallMinY - padding },
        { x: overallMinX - padding, y: overallMaxY + padding },
        { x: overallMaxX + padding, y: overallMaxY + padding }
      ];

      corners.forEach((corner) => {
        ctx.fillRect(
          corner.x - handleSize / 2,
          corner.y - handleSize / 2,
          handleSize,
          handleSize
        );
      });
    }

    // Rotation handle
    const rotateOffset = 20 / view.scale;
    const rotateRadius = 6 / view.scale;
    const padding = 25 / view.scale;

    const rotateX = (overallMinX + overallMaxX) / 2;
    const rotateY = overallMinY - padding - rotateOffset;

    // Draw rotation dot
    ctx.beginPath();
    ctx.arc(rotateX, rotateY, rotateRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#3b82f6';
    ctx.fill();
  }

  // Draw area selection rectangle
  if (isAreaSelecting && areaSelectionStart && areaSelectionEnd) {
    const minX = Math.min(areaSelectionStart.x, areaSelectionEnd.x);
    const minY = Math.min(areaSelectionStart.y, areaSelectionEnd.y);
    const maxX = Math.max(areaSelectionStart.x, areaSelectionEnd.x);
    const maxY = Math.max(areaSelectionStart.y, areaSelectionEnd.y);

    // Draw selection rectangle
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 1 / view.scale;
    ctx.setLineDash([5 / view.scale, 5 / view.scale]);
    ctx.strokeRect(minX, minY, maxX - minX, maxY - minY);
    ctx.setLineDash([]);

    // Draw semi-transparent fill
    ctx.fillStyle = 'rgba(59, 130, 246, 0.1)';
    ctx.fillRect(minX, minY, maxX - minX, maxY - minY);
  }
};
