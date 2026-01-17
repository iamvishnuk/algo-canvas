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
import { generateUUID } from '@/lib/canvas/utils';
import { findElementAtPosition } from '@/lib/canvas/hitDetection';
import { isElementInSelectionArea } from '@/lib/canvas/geometry';

export class CanvasEngine {
  readonly store: CanvasStore;
  private renderer: CanvasRenderer;

  private isPanning: boolean = false;
  private lastPanPosition: Point | null = null;
  private hitTolerance: number = 6;

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
      this.selectOrStartArea(position);
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
      this.updateAreaSelection(position);
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
    }
  }

  handleOnWheel(position: Point, delta: number) {
    this.zoomAt(position.x, position.y, delta);
  }

  handleOnClick(position: Point, tool: Tool) {
    if (tool === 'text') {
      this.startText(position);
    }
  }

  handleDoubleClick(position: Point) {}

  startPan(position: Point) {
    this.isPanning = true;
    this.lastPanPosition = position;
  }

  panTo(position: Point) {
    console.log('Panning to', position);
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

  zoomAt(x: number, y: number, direction: number) {
    const { scale, offsetX, offsetY } = this.store.view;

    const zoomFactor = 1 - direction * 0.1;
    const newScale = Math.min(5, Math.max(0.2, scale * zoomFactor));

    const worldX = (x - offsetX) / scale;
    const worldY = (y - offsetY) / scale;

    this.store.view.scale = newScale;
    this.store.view.offsetX = x - worldX * newScale;
    this.store.view.offsetY = y - worldY * newScale;

    this.store.commit();
  }

  zoomBy(delta: number) {
    const canvas = this.renderer['canvas'];

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    this.zoomAt(centerX, centerY, delta);
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

  removeElement(id: string) {
    this.store.elements.delete(id);
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
    console.log('Updating text draft to', content);
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
    this.store.commit();
  }

  cancelTextDraft() {
    this.store.textDraft = null;
    this.store.commit();
  }

  addArray(values: string[]) {
    const centerX =
      (this.renderer['canvas'].width / 2 - this.store.view.offsetX) /
      this.store.view.scale;
    const topY = (100 - this.store.view.offsetY) / this.store.view.scale;

    console.log(this.store.elements);

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

    const selectedId: Set<string> = new Set();

    for (const element of this.store.elements.values()) {
      if (isElementInSelectionArea(element, { minX, minY, maxX, maxY })) {
        selectedId.add(element.id);
      }
    }

    this.store.selectedElementIds = selectedId;
    this.store.selectedElementId =
      selectedId.size === 1 ? [...selectedId][0]! : null;

    this.store.isAreaSelecting = false;
    this.store.areaSelectionStart = null;
    this.store.areaSelectionEnd = null;
    this.store.commit();
  }
}
