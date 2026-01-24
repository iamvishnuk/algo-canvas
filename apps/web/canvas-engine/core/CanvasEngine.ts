import { CanvasStore } from './CanvasStore';
import { CanvasRenderer } from './CanvasRenderer';
import {
  CanvasElement,
  CanvasElementPatch,
  Point,
  Tool,
  TreeNode,
  ViewState
} from '@algocanvas/types/canvas';
import { ElementDefaultProperty } from '@/features/element/elementPropertySlice';
import {
  ElementBounds,
  generateUUID,
  getElementBounds,
  isPointInBounds
} from '@/lib/canvas/utils';
import {
  findElementAtPosition,
  getResizeHandle,
  ResizeHandle
} from '@/lib/canvas/hitDetection';
import { isElementInSelectionArea } from '@/lib/canvas/geometry';

export class CanvasEngine {
  readonly store: CanvasStore;
  private renderer: CanvasRenderer;

  private isPanning: boolean = false;
  private lastPanPosition: Point | null = null;
  private hitTolerance: number = 6;

  // Dragging State
  private isDraggingElements: boolean = false;
  private isDraggingMultipleElements: boolean = false;
  private isFirstDragMove: boolean = false;
  private lastDragWorldPos: Point | null = null;

  private draggingElementId: string | null = null;
  private dragElementOffset: Point = { x: 0, y: 0 };
  private multiDragOffsets: Map<string, Point> = new Map();

  // Resizing State
  private isResizing: boolean = false;
  private resizeHandle: ResizeHandle | null = null;
  private resizeElementId: string | null = null;
  private resizeInitialBound: ElementBounds | null = null;
  private resizeAnchor: Point | null = null;
  private resizingLineEnd: 'start' | 'end' | null = null;

  constructor(canvas: HTMLCanvasElement) {
    this.store = new CanvasStore();
    this.renderer = new CanvasRenderer(canvas, this.store);

    this.store.subscribe(() => this.renderer.render());

    this.store.commit();
  }

  render() {
    this.renderer.render();
  }

  setView(view: Partial<{ scale: number; offsetX: number; offsetY: number }>) {
    Object.assign(this.store.view, view);
    this.store.commit();
  }

  screenToWorld(x: number, y: number): Point {
    const rect = this.renderer['canvas'].getBoundingClientRect();
    const { offsetX, offsetY, scale } = this.store.view;

    return {
      x: (x - rect.left - offsetX) / scale,
      y: (y - rect.top - offsetY) / scale
    };
  }

  setTool() {
    // Clear selection when tool changes
    this.store.selectedElementId = null;
    this.store.selectedElementIds.clear();

    // Cancel interactions
    this.isDraggingElements = false;
    this.isDraggingMultipleElements = false;
    this.isResizing = false;
    this.resizingLineEnd = null;
    this.resizeHandle = null;
    this.resizeElementId = null;
    this.resizeInitialBound = null;
    this.resizeAnchor = null;
    this.lastDragWorldPos = null;
    this.multiDragOffsets.clear();

    // Cancel text editing if active
    this.store.textDraft = null;
    this.store.editingTextId = null;

    this.store.commit();
  }

  handleMouseDown(
    position: Point,
    tool: Tool,
    elementProperty: ElementDefaultProperty
  ) {
    if (tool === 'move') {
      this.startPan(position);
    }
    if (tool === 'rectangle') {
      this.startRectangle(position, elementProperty);
    }
    if (tool === 'circle') {
      this.startCircle(position, elementProperty);
    }
    if (tool === 'arrow') {
      this.startArrow(position, elementProperty);
    }
    if (tool === 'draw') {
      this.startPath(position, elementProperty);
    }
    if (tool === 'line') {
      this.startLine(position, elementProperty);
    }
    if (tool === 'selection') {
      this.startSelectionInteraction(position);
    }
  }

  handleMouseMove(position: Point, tool: Tool) {
    if (tool === 'move') {
      this.panTo(position);
    }
    if (tool === 'rectangle') {
      this.updateReactAngle(position);
    }
    if (tool === 'circle') {
      this.updateCircle(position);
    }
    if (tool === 'arrow') {
      this.updateArrow(position);
    }
    if (tool === 'draw') {
      this.updatePath(position);
    }
    if (tool === 'line') {
      this.updateLine(position);
    }
    if (tool === 'selection') {
      if (this.isResizing) {
        this.resizeSelection(position);
        return;
      }

      this.dragSelection(position);
      this.updateAreaSelection(position);
      return;
    }
  }

  handleMouseUp(position: Point, tool: Tool) {
    if (tool === 'move' && this.isPanning) {
      this.endPan();
    }
    if (tool === 'rectangle') {
      this.finishRectangle();
    }
    if (tool === 'circle') {
      this.finishCircle();
    }
    if (tool === 'arrow') {
      this.finishArrow();
    }
    if (tool === 'draw') {
      this.finishPath();
    }
    if (tool === 'line') {
      this.finishLine();
    }
    if (tool === 'selection') {
      this.finishAreaSelection();
      this.isResizing = false;
      this.resizingLineEnd = null;
      this.resizeHandle = null;
      this.resizeElementId = null;
      this.resizeInitialBound = null;
      this.resizeAnchor = null;
      this.endSelectionInteraction();
      return;
    }
  }

  handleOnWheel(position: Point, delta: number) {
    const step = delta > 0 ? -0.1 : 0.1;
    this.zoomAt(position.x, position.y, step);
  }

  handleOnClick(position: Point, tool: Tool) {
    if (tool === 'text') {
      this.startText(position);
    }
  }

  handleDoubleClick(position: Point) {
    this.startEditingText(position);
  }

  startPan(position: Point) {
    this.isPanning = true;
    this.lastPanPosition = position;
  }

  panTo(position: Point) {
    if (!this.isPanning || !this.lastPanPosition) return;

    const dx = position.x - this.lastPanPosition.x;
    const dy = position.y - this.lastPanPosition.y;

    this.store.view.offsetX += dx;
    this.store.view.offsetY += dy;
    this.lastPanPosition = position;
    this.store.commit();
  }

  endPan() {
    this.isPanning = false;
    this.lastPanPosition = null;
  }

  zoomAt(x: number, y: number, step: number) {
    const { scale, offsetX, offsetY } = this.store.view;

    const newScale = Math.min(5, Math.max(0.2, scale * (1 + step)));

    const worldX = (x - offsetX) / scale;
    const worldY = (y - offsetY) / scale;

    this.store.view.scale = newScale;
    this.store.view.offsetX = x - worldX * newScale;
    this.store.view.offsetY = y - worldY * newScale;

    this.store.commit();
  }

  zoomBy(step: number) {
    const canvas = this.renderer['canvas'];
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    this.zoomAt(centerX, centerY, step);
  }

  getView() {
    return { ...this.store.view };
  }

  onViewChange(listener: (view: ViewState) => void) {
    return this.store.subscribe(() => {
      listener(this.getView());
    });
  }

  resetZoom() {
    const canvas = this.renderer['canvas'];

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // world position at center before reset
    const { scale, offsetX, offsetY } = this.store.view;
    const worldX = (centerX - offsetX) / scale;
    const worldY = (centerY - offsetY) / scale;

    this.store.view.scale = 1;
    this.store.view.offsetX = centerX - worldX * 1;
    this.store.view.offsetY = centerY - worldY * 1;

    this.store.commit();
  }

  addElement(element: CanvasElement) {
    this.store.elements.set(element.id, element);
    this.store.commit();
  }

  updateElement<T extends CanvasElement>(
    id: string,
    patch: CanvasElementPatch<T>
  ) {
    const element = this.store.elements.get(id) as T | undefined;
    if (!element) return;

    const updated: T = {
      ...element,
      ...patch
    };

    this.store.elements.set(id, updated);
    this.store.commit();
  }

  removeElement() {
    if (this.store.selectedElementId !== null) {
      this.store.elements.delete(this.store.selectedElementId);
      this.store.selectedElementId = null;
      this.store.commit();
    }

    if (this.store.selectedElementIds.size > 0) {
      this.store.selectedElementIds.forEach((value) =>
        this.store.elements.delete(value)
      );
      this.store.commit();
    }
  }

  duplicateElement() {
    const elementsToDuplicate: CanvasElement[] = [];

    if (this.store.selectedElementIds.size > 0) {
      for (const id of this.store.selectedElementIds) {
        const el = this.store.elements.get(id);
        if (el) elementsToDuplicate.push(el);
      }
    } else if (this.store.selectedElementId) {
      const el = this.store.elements.get(this.store.selectedElementId);
      if (el) elementsToDuplicate.push(el);
    }

    if (elementsToDuplicate.length === 0) return;

    const offset = 20;
    const newIds: string[] = [];

    for (const element of elementsToDuplicate) {
      const id = generateUUID();

      this.store.elements.set(id, {
        ...element,
        id,
        x: element.x + offset,
        y: element.y + offset
      });

      newIds.push(id);
    }

    this.store.selectedElementId = null;
    this.store.selectedElementIds.clear();

    if (newIds.length === 1) {
      this.store.selectedElementId = newIds[0]!;
    } else {
      for (const id of newIds) {
        this.store.selectedElementIds.add(id);
      }
    }

    this.store.commit();
  }

  clear() {
    this.store.elements.clear();
    this.store.commit();
  }

  startRectangle(screen: Point, elementProperty: ElementDefaultProperty) {
    const worldPost = this.screenToWorld(screen.x, screen.y);

    this.store.previewStart = worldPost;

    this.store.previewElement = {
      id: generateUUID(),
      type: 'rectangle',
      x: worldPost.x,
      y: worldPost.y,
      width: 0,
      height: 0,
      ...elementProperty.rectangle
    };

    this.store.commit();
  }

  updateReactAngle(screen: Point) {
    const start = this.store.previewStart;
    const element = this.store.previewElement;
    if (!start || !element || element.type !== 'rectangle') return;

    const worldPos = this.screenToWorld(screen.x, screen.y);

    element.width = worldPos.x - start.x;
    element.height = worldPos.y - start.y;

    this.store.commit();
  }

  finishRectangle() {
    const element = this.store.previewElement;

    if (!element || element.type !== 'rectangle') return;

    if (element.height === 0 || element.width === 0) {
      this.store.previewElement = null;
      this.store.previewStart = null;
      this.store.commit();
      return;
    }

    this.store.elements.set(element.id, element);
    this.store.previewElement = null;
    this.store.previewStart = null;
    this.store.commit();
  }

  startCircle(screen: Point, elementProperty: ElementDefaultProperty) {
    const worldPos = this.screenToWorld(screen.x, screen.y);

    this.store.previewStart = worldPos;

    this.store.previewElement = {
      id: generateUUID(),
      type: 'circle',
      x: worldPos.x,
      y: worldPos.y,
      radiusX: 0,
      radiusY: 0,
      ...elementProperty.circle
    };

    this.store.commit();
  }

  updateCircle(screen: Point) {
    const start = this.store.previewStart;
    const element = this.store.previewElement;

    if (!start || !element || element.type !== 'circle') return;

    const worldPos = this.screenToWorld(screen.x, screen.y);

    element.radiusX = Math.abs(worldPos.x - start.x) / 2;
    element.radiusY = Math.abs(worldPos.y - start.y) / 2;
    element.x = (start.x + worldPos.x) / 2;
    element.y = (start.y + worldPos.y) / 2;

    this.store.commit();
  }

  finishCircle() {
    const element = this.store.previewElement;

    if (!element || element.type !== 'circle') return;

    if (element.radiusX === 0 || element.radiusY === 0) {
      this.store.previewElement = null;
      this.store.previewStart = null;
      this.store.commit();
      return;
    }

    this.store.elements.set(element.id, element);
    this.store.previewElement = null;
    this.store.previewStart = null;
    this.store.commit();
  }

  startArrow(screen: Point, elementProperty: ElementDefaultProperty) {
    const worldPos = this.screenToWorld(screen.x, screen.y);

    this.store.previewStart = worldPos;

    this.store.previewElement = {
      id: generateUUID(),
      type: 'arrow',
      x: worldPos.x,
      y: worldPos.y,
      endX: worldPos.x,
      endY: worldPos.y,
      ...elementProperty.arrow
    };

    this.store.commit();
  }

  updateArrow(screen: Point) {
    const start = this.store.previewStart;
    const element = this.store.previewElement;

    if (!start || !element || element.type !== 'arrow') return;

    const worldPos = this.screenToWorld(screen.x, screen.y);

    element.endX = worldPos.x;
    element.endY = worldPos.y;

    this.store.commit();
  }

  finishArrow() {
    const element = this.store.previewElement;

    if (!element || element.type !== 'arrow') return;

    if (element.endX === element.x && element.endY === element.y) {
      this.store.previewElement = null;
      this.store.previewStart = null;
      this.store.commit();
      return;
    }

    this.store.elements.set(element.id, element);
    this.store.previewElement = null;
    this.store.previewStart = null;
    this.store.commit();
  }

  startPath(screen: Point, elementProperty: ElementDefaultProperty) {
    const worldPos = this.screenToWorld(screen.x, screen.y);

    this.store.previewStart = worldPos;

    this.store.previewElement = {
      id: generateUUID(),
      type: 'draw',
      x: 0,
      y: 0,
      points: [worldPos],
      ...elementProperty.draw
    };

    this.store.commit();
  }

  updatePath(screen: Point) {
    const element = this.store.previewElement;

    if (!element || element.type !== 'draw') return;

    const worldPos = this.screenToWorld(screen.x, screen.y);

    element.points.push(worldPos);

    this.store.commit();
  }

  finishPath() {
    const element = this.store.previewElement;

    if (!element || element.type !== 'draw') return;

    if (element.points.length < 2) {
      this.store.previewElement = null;
      this.store.previewStart = null;
      this.store.commit();
      return;
    }

    this.store.elements.set(element.id, element);
    this.store.previewElement = null;
    this.store.previewStart = null;
    this.store.commit();
  }

  startLine(screen: Point, elementProperty: ElementDefaultProperty) {
    const worldPos = this.screenToWorld(screen.x, screen.y);

    this.store.previewStart = worldPos;

    this.store.previewElement = {
      id: generateUUID(),
      type: 'line',
      x: worldPos.x,
      y: worldPos.y,
      endX: worldPos.x,
      endY: worldPos.y,
      ...elementProperty.line
    };

    this.store.commit();
  }

  updateLine(screen: Point) {
    const start = this.store.previewStart;
    const element = this.store.previewElement;

    if (!start || !element || element.type !== 'line') return;

    const worldPos = this.screenToWorld(screen.x, screen.y);

    element.endX = worldPos.x;
    element.endY = worldPos.y;

    this.store.commit();
  }

  finishLine() {
    const element = this.store.previewElement;

    if (!element || element.type !== 'line') return;

    if (element.endX === element.x && element.endY === element.y) {
      this.store.previewElement = null;
      this.store.previewStart = null;
      this.store.commit();
      return;
    }

    this.store.elements.set(element.id, element);
    this.store.previewElement = null;
    this.store.previewStart = null;
    this.store.commit();
  }

  startText(screen: Point) {
    const worldPos = this.screenToWorld(screen.x, screen.y);

    this.store.textDraft = {
      id: generateUUID(),
      content: '',
      x: worldPos.x,
      y: worldPos.y
    };

    this.store.commit();
  }

  updateTextDraft(content: string) {
    if (!this.store.textDraft) return;

    this.store.textDraft = {
      ...this.store.textDraft,
      content
    };
    this.store.commit();
  }

  commitTextDraft(elementProperty: ElementDefaultProperty) {
    const draft = this.store.textDraft;
    if (!draft || draft.content.trim() === '') {
      this.store.textDraft = null;
      this.store.commit();
      return;
    }

    this.store.elements.set(draft.id, {
      id: draft.id,
      type: 'text',
      x: draft.x,
      y: draft.y,
      text: draft.content,
      ...elementProperty.text
    });
    this.store.textDraft = null;
    this.store.editingTextId = null;
    this.store.commit();
  }

  cancelTextDraft() {
    this.store.textDraft = null;
    this.store.editingTextId = null;
    this.store.commit();
  }

  addArray(values: string[]) {
    const centerX =
      (this.renderer['canvas'].width / 2 - this.store.view.offsetX) /
      this.store.view.scale;
    const topY = (100 - this.store.view.offsetY) / this.store.view.scale;

    const elementId = generateUUID();

    this.store.elements.set(elementId, {
      id: elementId,
      type: 'array',
      x: centerX - (values.length * 50) / 2,
      y: topY,
      values: values,
      rotate: 0
    });
    this.store.commit();
  }

  addLinkedList(values: string[]) {
    const centerX =
      (this.renderer['canvas'].width / 2 - this.store.view.offsetX) /
      this.store.view.scale;
    const topY = (100 - this.store.view.offsetY) / this.store.view.scale;

    const elementId = generateUUID();

    this.store.elements.set(elementId, {
      id: elementId,
      type: 'linked-list',
      x: centerX - (values.length * 60) / 2,
      y: topY,
      values: values,
      rotate: 0
    });
    this.store.commit();
  }

  addBinaryTree(root: TreeNode) {
    const centerX =
      (this.renderer['canvas'].width / 2 - this.store.view.offsetX) /
      this.store.view.scale;
    const topY = (100 - this.store.view.offsetY) / this.store.view.scale;

    const elementId = generateUUID();

    this.store.elements.set(elementId, {
      id: elementId,
      type: 'binary-tree',
      x: centerX,
      y: topY,
      root,
      rotate: 0
    });
    this.store.commit();
  }

  selectedAt(position: Point) {
    const worldPos = this.screenToWorld(position.x, position.y);

    const elements = Array.from(this.store.elements.values()).reverse();

    const index = findElementAtPosition(
      worldPos,
      elements,
      this.hitTolerance / this.store.view.scale
    );

    if (index === null) {
      this.clearSelection();
      return;
    }

    const element = elements[index];

    if (!element) {
      this.clearSelection();
      return;
    }

    this.store.selectedElementId = element.id;
    this.store.selectedElementIds.clear();
    this.store.commit();
    return element;
  }

  clearSelection() {
    this.store.selectedElementId = null;
    this.store.selectedElementIds.clear();
    this.store.commit();
  }

  selectOrStartArea(start: Point) {
    const worldPos = this.screenToWorld(start.x, start.y);
    const elements = Array.from(this.store.elements.values());

    const index = findElementAtPosition(
      worldPos,
      elements,
      this.hitTolerance / this.store.view.scale
    );

    if (index !== null) {
      const element = elements[index];
      if (!element) {
        this.clearSelection();
        return;
      }
      this.store.selectedElementId = element.id!;
      this.store.selectedElementIds.clear();
      this.store.commit();
      return;
    }

    this.store.isAreaSelecting = true;
    this.store.areaSelectionStart = worldPos;
    this.store.areaSelectionEnd = worldPos;
    this.store.commit();
  }

  updateAreaSelection(end: Point) {
    if (!this.store.isAreaSelecting) return;

    const worldPos = this.screenToWorld(end.x, end.y);

    this.store.areaSelectionEnd = worldPos;
    this.store.commit();
  }

  finishAreaSelection() {
    const { isAreaSelecting, areaSelectionStart, areaSelectionEnd } =
      this.store;
    if (!isAreaSelecting || !areaSelectionStart || !areaSelectionEnd) return;

    const minX = Math.min(areaSelectionStart.x, areaSelectionEnd.x);
    const maxX = Math.max(areaSelectionStart.x, areaSelectionEnd.x);
    const minY = Math.min(areaSelectionStart.y, areaSelectionEnd.y);
    const maxY = Math.max(areaSelectionStart.y, areaSelectionEnd.y);

    const selectedIds: string[] = [];

    for (const el of this.store.elements.values()) {
      if (isElementInSelectionArea(el, { minX, minY, maxX, maxY })) {
        selectedIds.push(el.id);
      }
    }

    // ✅ SINGLE SELECTION
    if (selectedIds.length === 1) {
      this.store.selectedElementId = selectedIds[0]!;
      this.store.selectedElementIds.clear();
    }
    // ✅ MULTI SELECTION
    else if (selectedIds.length > 1) {
      this.store.selectedElementId = null;
      this.store.selectedElementIds = new Set(selectedIds);
    }
    // ✅ NOTHING SELECTED
    else {
      this.store.selectedElementId = null;
      this.store.selectedElementIds.clear();
    }

    this.store.isAreaSelecting = false;
    this.store.areaSelectionStart = null;
    this.store.areaSelectionEnd = null;

    this.store.commit();
  }

  getCombinedBounds(elementIds: string[], padding: number = 0) {
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    for (const id of elementIds) {
      const element = this.store.elements.get(id);
      if (!element) continue;

      const bounds = getElementBounds(element);
      if (!bounds) continue;

      minX = Math.min(minX, bounds.minX);
      minY = Math.min(minY, bounds.minY);
      maxX = Math.max(maxX, bounds.maxX);
      maxY = Math.max(maxY, bounds.maxY);
    }

    if (minX === Infinity) return null;

    return {
      minX: minX - padding,
      minY: minY - padding,
      maxX: maxX + padding,
      maxY: maxY + padding
    };
  }

  startSelectionInteraction(screen: Point) {
    const worldPos = this.screenToWorld(screen.x, screen.y);
    const HIT = this.hitTolerance / this.store.view.scale;
    const PAD = 10 / this.store.view.scale;

    const elements = Array.from(this.store.elements.values()).reverse();

    // 1️⃣ LINE / ARROW — DIRECT DRAG OR RESIZE (NO PRESELECT)
    for (const el of elements) {
      if (el.type !== 'line' && el.type !== 'arrow') continue;

      const end = this.getLineEndpointHandle(worldPos, el);
      if (end) {
        this.store.selectedElementId = el.id;
        this.store.selectedElementIds.clear();

        this.isResizing = true;
        this.resizeElementId = el.id;
        this.resizingLineEnd = end;

        this.store.commit();
        return;
      }

      if (
        this.isPointNearLine(
          worldPos,
          { x: el.x, y: el.y },
          { x: el.endX, y: el.endY },
          HIT
        )
      ) {
        this.store.selectedElementId = el.id;
        this.store.selectedElementIds.clear();

        this.isDraggingElements = true;
        this.isDraggingMultipleElements = false;
        this.isFirstDragMove = true;
        this.draggingElementId = el.id;
        this.lastDragWorldPos = worldPos;

        this.store.commit();
        return;
      }
    }

    // 2️⃣ RECT / CIRCLE / TEXT RESIZE
    if (this.store.selectedElementId) {
      const element = this.store.elements.get(this.store.selectedElementId);
      if (element && element.type !== 'line' && element.type !== 'arrow') {
        const bounds = getElementBounds(element);
        if (bounds) {
          const handle = getResizeHandle(worldPos, element, this.store.view);
          if (handle) {
            this.startResize(element, handle, bounds);
            return;
          }
        }
      }
    }

    // 3️⃣ MULTI SELECTION DRAG
    if (this.store.selectedElementIds.size > 0) {
      const bounds = this.getCombinedBounds(
        [...this.store.selectedElementIds],
        PAD
      );

      if (bounds && isPointInBounds(worldPos, bounds)) {
        this.multiDragOffsets.clear();

        for (const id of this.store.selectedElementIds) {
          const el = this.store.elements.get(id);
          if (el) {
            this.multiDragOffsets.set(id, {
              x: worldPos.x - el.x,
              y: worldPos.y - el.y
            });
          }
        }

        this.isDraggingElements = true;
        this.isDraggingMultipleElements =
          this.store.selectedElementIds.size > 1;
        this.isFirstDragMove = true;

        if (this.store.selectedElementIds.size === 1) {
          this.draggingElementId = [...this.store.selectedElementIds][0]!;
        }

        return;
      }
    }

    // 4️⃣ SINGLE ELEMENT DRAG
    if (this.store.selectedElementId) {
      const el = this.store.elements.get(this.store.selectedElementId);
      if (el) {
        const bounds = getElementBounds(el);
        if (bounds) {
          const pad = 10 / this.store.view.scale;
          const selectionBounds = {
            minX: bounds.minX - pad,
            minY: bounds.minY - pad,
            maxX: bounds.maxX + pad,
            maxY: bounds.maxY + pad
          };

          if (isPointInBounds(worldPos, selectionBounds)) {
            this.isDraggingElements = true;
            this.isFirstDragMove = true;
            this.draggingElementId = el.id;
            this.dragElementOffset = {
              x: worldPos.x - el.x,
              y: worldPos.y - el.y
            };
            return;
          }
        }
      }
    }

    // 5️⃣ CLICK TO SELECT
    const index = findElementAtPosition(worldPos, elements, HIT);
    if (index !== null) {
      const el = elements[index];
      if (!el) return;

      this.store.selectedElementId = el.id;
      this.store.selectedElementIds.clear();
      this.store.commit();

      this.isDraggingElements = true;
      this.isFirstDragMove = true;
      this.draggingElementId = el.id;
      this.dragElementOffset = {
        x: worldPos.x - el.x,
        y: worldPos.y - el.y
      };

      return;
    }

    // 6️⃣ EMPTY SPACE → AREA SELECT
    this.clearSelection();
    this.store.isAreaSelecting = true;
    this.store.areaSelectionStart = worldPos;
    this.store.areaSelectionEnd = worldPos;
    this.store.commit();
  }

  dragSelection(screen: Point) {
    if (!this.isDraggingElements) return;

    const worldPos = this.screenToWorld(screen.x, screen.y);

    if (
      this.isDraggingMultipleElements &&
      this.store.selectedElementIds.size > 1
    ) {
      for (const id of this.store.selectedElementIds) {
        const offset = this.multiDragOffsets.get(id);
        const el = this.store.elements.get(id);
        if (!offset || !el) continue;

        this.store.elements.set(id, {
          ...el,
          x: worldPos.x - offset.x,
          y: worldPos.y - offset.y
        });
      }
    } else if (this.draggingElementId) {
      const el = this.store.elements.get(this.draggingElementId);
      if (!el) return;

      if (
        (el.type === 'line' || el.type === 'arrow') &&
        this.lastDragWorldPos
      ) {
        const dx = worldPos.x - this.lastDragWorldPos.x;
        const dy = worldPos.y - this.lastDragWorldPos.y;

        this.store.elements.set(el.id, {
          ...el,
          x: el.x + dx,
          y: el.y + dy,
          endX: el.endX + dx,
          endY: el.endY + dy
        });

        this.lastDragWorldPos = worldPos;
      } else {
        this.store.elements.set(el.id, {
          ...el,
          x: worldPos.x - this.dragElementOffset.x,
          y: worldPos.y - this.dragElementOffset.y
        });
      }
    }

    this.isFirstDragMove = false;
    this.store.commit();
  }

  endSelectionInteraction() {
    this.isDraggingElements = false;
    this.isDraggingMultipleElements = false;
    this.isFirstDragMove = false;
    this.draggingElementId = null;
    this.lastDragWorldPos = null;
    this.multiDragOffsets.clear();
  }

  startResize(
    element: CanvasElement,
    handle: ResizeHandle,
    bound: ElementBounds
  ) {
    const padding = 10 / this.store.view.scale;
    let anchor: Point;

    switch (handle) {
      case 'top-left':
        anchor = { x: bound.maxX + padding, y: bound.maxY + padding };
        break;
      case 'top-right':
        anchor = { x: bound.minX - padding, y: bound.maxY + padding };
        break;
      case 'bottom-left':
        anchor = { x: bound.maxX + padding, y: bound.minY - padding };
        break;
      case 'bottom-right':
        anchor = { x: bound.minX - padding, y: bound.minY - padding };
        break;
      default:
        return;
    }

    this.isResizing = true;
    this.resizeHandle = handle;
    this.resizeElementId = element.id;
    this.resizeInitialBound = bound;
    this.resizeAnchor = anchor;
  }

  resizeSelection(screen: Point) {
    if (this.isResizing && this.resizingLineEnd) {
      const element = this.store.elements.get(this.resizeElementId!);
      if (!element || (element.type !== 'line' && element.type !== 'arrow'))
        return;
      const worldPos = this.screenToWorld(screen.x, screen.y);

      if (this.resizingLineEnd === 'start') {
        this.store.elements.set(element.id, {
          ...element,
          x: worldPos.x,
          y: worldPos.y
        });
      } else {
        this.store.elements.set(element.id, {
          ...element,
          endX: worldPos.x,
          endY: worldPos.y
        });
      }

      this.store.commit();
      return;
    }

    if (!this.isResizing || !this.resizeElementId || !this.resizeInitialBound)
      return;

    const worldPos = this.screenToWorld(screen.x, screen.y);
    const MIN = 10 / this.store.view.scale;

    let { minX, minY, maxX, maxY } = this.resizeInitialBound;

    switch (this.resizeHandle) {
      case 'top-left':
        minX = Math.min(worldPos.x, maxX - MIN);
        minY = Math.min(worldPos.y, maxY - MIN);
        break;
      case 'top-right':
        maxX = Math.max(worldPos.x, minX + MIN);
        minY = Math.min(worldPos.y, maxY - MIN);
        break;
      case 'bottom-left':
        minX = Math.min(worldPos.x, maxX - MIN);
        maxY = Math.max(worldPos.y, minY + MIN);
        break;
      case 'bottom-right':
        maxX = Math.max(worldPos.x, minX + MIN);
        maxY = Math.max(worldPos.y, minY + MIN);
        break;
    }

    const element = this.store.elements.get(this.resizeElementId);
    if (!element) return;

    switch (element.type) {
      case 'rectangle': {
        this.store.elements.set(element.id, {
          ...element,
          x: minX,
          y: minY,
          width: maxX - minX,
          height: maxY - minY
        });
        break;
      }
      case 'circle': {
        this.store.elements.set(element.id, {
          ...element,
          x: (minX + maxX) / 2,
          y: (minY + maxY) / 2,
          radiusX: (maxX - minX) / 2,
          radiusY: (maxY - minY) / 2
        });
        break;
      }
      case 'line':
      case 'arrow': {
        const originWidth = Math.abs(element.endX - element.x) || 1;
        const originHeight = Math.abs(element.endY - element.y) || 1;
        const scaleX = (maxX - minX) / originWidth;
        const scaleY = (maxY - minY) / originHeight;

        // Determine original min positions
        const originalMinX = Math.min(element.x, element.endX);
        const originalMinY = Math.min(element.y, element.endY);

        // Scale relative to original min positions, then translate to new min positions
        const newX = minX + (element.x - originalMinX) * scaleX;
        const newY = minY + (element.y - originalMinY) * scaleY;
        const newEndX = minX + (element.endX - originalMinX) * scaleX;
        const newEndY = minY + (element.endY - originalMinY) * scaleY;
        this.store.elements.set(element.id, {
          ...element,
          x: newX,
          y: newY,
          endX: newEndX,
          endY: newEndY
        });
        break;
      }
      case 'draw': {
        const xs = element.points.map((p) => element.x + p.x);
        const ys = element.points.map((p) => element.y + p.y);
        const oldMinX = Math.min(...xs);
        const oldMaxX = Math.max(...xs);
        const oldMinY = Math.min(...ys);
        const oldMaxY = Math.max(...ys);
        const originWidth = oldMaxX - oldMinX || 1;
        const originHeight = oldMaxY - oldMinY || 1;

        const newWidth = maxX - minX;
        const newHeight = maxY - minY;

        const scaleX = newWidth / originWidth;
        const scaleY = newHeight / originHeight;

        const newPoints: Point[] = element.points.map((p) => {
          const absX = element.x + p.x;
          const absY = element.y + p.y;

          const scaledX = (absX - oldMinX) * scaleX + minX;
          const scaledY = (absY - oldMinY) * scaleY + minY;

          return {
            x: scaledX - minX,
            y: scaledY - minY
          };
        });

        this.store.elements.set(element.id, {
          ...element,
          x: minX,
          y: minY,
          points: newPoints
        });
        break;
      }
      case 'text': {
        const oldElementBounds = getElementBounds(element);
        if (oldElementBounds) {
          const oldHeight = oldElementBounds.maxY - oldElementBounds.minY || 1;
          const newHeight = maxY - minY;
          const scaleY = newHeight / oldHeight;

          this.store.elements.set(element.id, {
            ...element,
            x: minX,
            y: minY,
            fontSize: Math.max(8, element.fontSize * scaleY)
          });
        }
        break;
      }
      default: {
        // Data structures (array, linked-list, binary-tree) = just move don't resize
        this.store.elements.set(element.id, { ...element, x: minX, y: minY });
        break;
      }
    }

    this.store.commit();
  }

  private getLineEndpointHandle(
    worldPos: Point,
    element: CanvasElement
  ): 'start' | 'end' | null {
    if (element.type !== 'line' && element.type !== 'arrow') return null;

    const HIT = 6 / this.store.view.scale;

    const startDist =
      (worldPos.x - element.x) ** 2 + (worldPos.y - element.y) ** 2;

    const endDist =
      (worldPos.x - element.endX) ** 2 + (worldPos.y - element.endY) ** 2;

    if (startDist <= HIT * HIT) return 'start';
    if (endDist <= HIT * HIT) return 'end';

    return null;
  }

  private isPointNearLine(p: Point, a: Point, b: Point, tolerance: number) {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const lenSq = dx * dx + dy * dy;
    if (lenSq === 0) return false;

    let t = ((p.x - a.x) * dx + (p.y - a.y) * dy) / lenSq;
    t = Math.max(0, Math.min(1, t));

    const projX = a.x + t * dx;
    const projY = a.y + t * dy;

    const distSq = (p.x - projX) ** 2 + (p.y - projY) ** 2;
    return distSq <= tolerance * tolerance;
  }

  startEditingText(screen: Point) {
    const worldPos = this.screenToWorld(screen.x, screen.y);

    const HIT = this.hitTolerance / this.store.view.scale;
    const elements = Array.from(this.store.elements.values()).reverse();

    const index = findElementAtPosition(worldPos, elements, HIT);
    if (index === null) return;

    const element = elements[index];
    if (!element || element.type !== 'text') return;

    this.store.editingTextId = element.id;

    this.store.textDraft = {
      id: element.id,
      x: element.x,
      y: element.y,
      content: element.text
    };

    this.store.selectedElementId = null;
    this.store.selectedElementIds.clear();

    this.store.commit();
  }

  updateElementProperty(propertyKey: string, value: string | number) {
    const selectedId = this.store.selectedElementId;
    if (!selectedId) return;

    const element = this.store.elements.get(selectedId);
    if (!element) return;

    this.store.elements.set(element.id, { ...element, [propertyKey]: value });
    this.store.commit();
  }

  getSelectedElement() {
    const id = this.store.selectedElementId;
    if (!id) return null;

    return this.store.elements.get(id) ?? null;
  }

  updateDataStructuresValues(values: string[] | TreeNode) {
    const elementId = this.store.selectedElementId;
    if (!elementId) return;

    const element = this.store.elements.get(elementId);
    if (!element) return;

    if (element.type === 'array') {
      this.store.elements.set(element.id, {
        ...element,
        values: values as string[]
      });
    }

    if (element.type === 'linked-list') {
      this.store.elements.set(element.id, {
        ...element,
        values: values as string[]
      });
    }

    if (element.type === 'binary-tree') {
      this.store.elements.set(element.id, {
        ...element,
        root: values as TreeNode
      });
    }

    this.store.commit();
  }
}
