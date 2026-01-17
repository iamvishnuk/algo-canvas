import { drawSelectionBox } from '@/lib/canvas/rendering/drawSelectionBox';
import { drawElements } from '../rendering/drawElements';
import { drawGrid } from '../rendering/drawGrid';
import { CanvasStore } from './CanvasStore';

export class CanvasRenderer {
  private ctx: CanvasRenderingContext2D;

  constructor(
    private canvas: HTMLCanvasElement,
    private store: CanvasStore
  ) {
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas context not found');
    this.ctx = ctx;
  }

  render() {
    const { elements, view } = this.store;

    // RESET TRANSFORM
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);

    // CLEAR CANVAS
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // DRAW GRID (screen space)
    drawGrid(this.ctx, this.canvas, view);

    // WORLD SPACE
    this.ctx.save();
    this.ctx.translate(view.offsetX, view.offsetY);
    this.ctx.scale(view.scale, view.scale);

    drawElements(this.ctx, [...elements.values()], view.scale);

    if (this.store.previewElement) {
      drawElements(this.ctx, [this.store.previewElement], view.scale);
    }

    drawSelectionBox(
      this.ctx,
      this.store.selectedElementId,
      [...this.store.elements.values()],
      view,
      [...this.store.selectedElementIds],
      this.store.isAreaSelecting,
      this.store.areaSelectionStart,
      this.store.areaSelectionEnd
    );

    this.ctx.restore();
  }
}
