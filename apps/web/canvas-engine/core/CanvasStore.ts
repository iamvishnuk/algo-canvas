import { CanvasElement, Point, Tool, ViewState } from '@algocanvas/types';

export class CanvasStore {
  elements = new Map<string, CanvasElement>();

  history = {
    past: [] as Map<string, CanvasElement>[],
    future: [] as Map<string, CanvasElement>[]
  };

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

  private HISTORY_LIMIT = 50;

  textDraft: { id: string; content: string; x: number; y: number } | null =
    null;

  view: ViewState = {
    scale: 1,
    offsetX: 0,
    offsetY: 0
  };

  private listeners = new Set<() => void>();

  private cloneElements(): Map<string, CanvasElement> {
    return new Map(
      [...this.elements.entries()].map(([id, el]) => [id, structuredClone(el)])
    );
  }

  private restoreElements(snapshot: Map<string, CanvasElement>) {
    this.elements.clear();

    for (const [id, el] of snapshot.entries()) {
      this.elements.set(id, structuredClone(el));
    }
  }

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  commit() {
    this.listeners.forEach((l) => l());
  }

  saveToHistory() {
    this.history.past.push(this.cloneElements());

    if (this.history.past.length > this.HISTORY_LIMIT) {
      this.history.past.shift();
    }

    this.history.future = [];
  }

  undo() {
    if (this.history.past.length === 0) return;

    this.history.future.push(this.cloneElements());

    const previous = this.history.past.pop()!;
    this.restoreElements(previous);

    this.selectedElementId = null;
    this.selectedElementIds.clear();

    this.commit();
  }

  redo() {
    if (this.history.future.length === 0) return;

    this.history.past.push(this.cloneElements());

    const next = this.history.future.pop()!;
    this.restoreElements(next);

    this.selectedElementId = null;
    this.selectedElementIds.clear();

    this.commit();
  }
}
