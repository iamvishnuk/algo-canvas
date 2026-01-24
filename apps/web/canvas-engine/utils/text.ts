let measureCanvas: HTMLCanvasElement | null = null;
let measureCtx: CanvasRenderingContext2D | null = null;

function getMeasureContext(): CanvasRenderingContext2D | null {
  if (typeof document === 'undefined') return null;

  if (!measureCanvas) {
    measureCanvas = document.createElement('canvas');
    measureCtx = measureCanvas.getContext('2d');
  }

  return measureCtx;
}

export const measureTextWidth = (
  text: string,
  fontSize: number,
  fontFamily: string,
  fontWeight: string = 'normal',
  fontStyle: string = 'normal'
): number => {
  const ctx = getMeasureContext();

  if (!ctx) {
    return text.length * fontSize * 0.6;
  }

  ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`;

  const lines = text.split('\n');

  let maxWidth = 0;
  for (const line of lines) {
    const width = ctx.measureText(line || ' ').width;
    maxWidth = Math.max(maxWidth, width);
  }

  return maxWidth;
};
