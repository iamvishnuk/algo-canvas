import { DrawElements } from '@workspace/types/canvas';

export const drawElements = (
  ctx: CanvasRenderingContext2D,
  elements: DrawElements[],
  scale: number
) => {
  elements.forEach((element) => {
    if (element.type === 'draw') {
      if (element.points.length < 2) return;

      ctx.strokeStyle = element.color;
      ctx.lineWidth = 2 / scale;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.beginPath();
      ctx.moveTo(element.points[0]!.x, element.points[0]!.y);

      for (let i = 1; i < element.points.length; i++) {
        ctx.lineTo(element.points[i]!.x, element.points[i]!.y);
      }
      ctx.stroke();
    } else if (element.type === 'circle') {
      ctx.strokeStyle = element.color;
      ctx.lineWidth = 2 / scale;

      ctx.beginPath();
      ctx.arc(element.centerX, element.centerY, element.radius, 0, Math.PI * 2);
      ctx.stroke();
    } else if (element.type === 'rectangle') {
      ctx.strokeStyle = '#7A3EFF';
      ctx.lineWidth = 2 / scale;

      ctx.beginPath();
      ctx.rect(element.x, element.y, element.width, element.height);
      ctx.stroke();
    } else if (element.type === 'line') {
      ctx.strokeStyle = '#7A3EFF';
      ctx.lineWidth = 2 / scale;

      ctx.beginPath();
      ctx.moveTo(element.startX, element.startY);
      ctx.lineTo(element.endX, element.endY);

      ctx.stroke();
    }
  });
};
