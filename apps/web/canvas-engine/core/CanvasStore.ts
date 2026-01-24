import { CanvasElement, Point, Tool, ViewState } from '@algocanvas/types';

export class CanvasStore {
  elements = new Map<string, CanvasElement>();

  activeTool: Tool = 'selection';

  previewElement: CanvasElement | null = null;
  previewStart: Point | null = null;

  // Selection State
  selectedElementId: string | null = null;
  selectedElementIds: Set<string> = new Set();

  isAreaSelecting: boolean = false;
  areaSelectionStart: Point | null = null;
  areaSelectionEnd: Point | null = null;

  editingTextId: string | null = null;

  textDraft: { id: string; content: string; x: number; y: number } | null =
    null;

  view: ViewState = {
    scale: 1,
    offsetX: 0,
    offsetY: 0
  };

  private listeners = new Set<() => void>();

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  commit() {
    this.listeners.forEach((l) => l());
  }
}
