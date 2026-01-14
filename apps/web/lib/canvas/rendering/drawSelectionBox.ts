import { DrawElements, DrawPoint, ViewState } from '@algocanvas/types/canvas';
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
  selectedElementId: string | null,
  elements: DrawElements[],
  view: ViewState,
  selectedElementIds: string[],
  isAreaSelecting: boolean,
  areaSelectionStart: DrawPoint | null,
  areaSelectionEnd: DrawPoint | null
) => {
  // ================= SINGLE SELECTION =================
  if (selectedElementId !== null) {
    const element = elements.find((ele) => ele.id === selectedElementId);
    if (!element) return;

    const bounds = getElementBounds(element);
    if (!bounds) return;

    const { minX, minY, maxX, maxY } = bounds;
    const padding = 10 / view.scale;
    const handleSize = 8 / view.scale;
    const rotateOffset = 20 / view.scale;
    const rotateRadius = 6 / view.scale;

    const isRectangle = element.type === 'rectangle';
    const isText = element.type === 'text';
    const isRotatable = isRectangle || isText;
    const isRotated = isRotatable && (element.rotate ?? 0) !== 0;

    // Both text and rectangle rotate around the center of their bounds
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;

    ctx.save();

    // 🔹 Rotate selection box for rotatable elements (rectangle, text)
    if (isRotated) {
      ctx.translate(centerX, centerY);
      ctx.rotate(element.rotate);
      ctx.translate(-centerX, -centerY);
    }

    // 🔹 Selection rectangle
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

    // 🔹 Corner resize handles
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

    // 🔹 ROTATION HANDLE (for rotatable elements: rectangle, text)
    if (isRotatable) {
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
  }

  // ================= MULTI SELECTION =================
  if (selectedElementIds.length > 0) {
    selectedElementIds.forEach((id) => {
      const element = elements.find((elem) => elem.id === id);
      if (!element) return;

      const bounds = getElementBounds(element);
      if (!bounds) return;

      const padding = 5 / view.scale;
      const { minX, minY, maxX, maxY } = bounds;

      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 2 / view.scale;

      ctx.strokeRect(
        minX - padding,
        minY - padding,
        maxX - minX + padding * 2,
        maxY - minY + padding * 2
      );
    });

    let overallMinX = Infinity;
    let overallMinY = Infinity;
    let overallMaxX = -Infinity;
    let overallMaxY = -Infinity;

    selectedElementIds.forEach((id) => {
      const element = elements.find((elem) => elem.id === id);
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

      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 3 / view.scale;
      ctx.setLineDash([5 / view.scale, 5 / view.scale]);

      ctx.strokeRect(
        overallMinX - padding,
        overallMinY - padding,
        overallMaxX - overallMinX + padding * 2,
        overallMaxY - overallMinY + padding * 2
      );

      ctx.setLineDash([]);

      // 🔹 Overall resize handles
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

      // 🔹 ROTATION HANDLE (ONLY IF ALL ARE RECTANGLES)
      const allRectangles = selectedElementIds.every((id) => {
        const element = elements.find((elem) => elem.id === id);
        return element?.type === 'rectangle';
      });

      if (allRectangles) {
        const rotateOffset = 20 / view.scale;
        const rotateRadius = 6 / view.scale;

        const rotateX = (overallMinX + overallMaxX) / 2;
        const rotateY = overallMinY - padding - rotateOffset;

        ctx.beginPath();
        ctx.arc(rotateX, rotateY, rotateRadius, 0, Math.PI * 2);
        ctx.fillStyle = '#3b82f6';
        ctx.fill();
      }
    }
  }

  // ================= AREA SELECTION =================
  if (isAreaSelecting && areaSelectionStart && areaSelectionEnd) {
    const minX = Math.min(areaSelectionStart.x, areaSelectionEnd.x);
    const minY = Math.min(areaSelectionStart.y, areaSelectionEnd.y);
    const maxX = Math.max(areaSelectionStart.x, areaSelectionEnd.x);
    const maxY = Math.max(areaSelectionStart.y, areaSelectionEnd.y);

    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 1 / view.scale;
    ctx.setLineDash([5 / view.scale, 5 / view.scale]);

    ctx.strokeRect(minX, minY, maxX - minX, maxY - minY);

    ctx.setLineDash([]);
    ctx.fillStyle = 'rgba(59, 130, 246, 0.1)';
    ctx.fillRect(minX, minY, maxX - minX, maxY - minY);
  }
};
