import { DSAElement } from '@/lib/canvas/constant';
import { resizeElement } from '@/lib/canvas/utils';
import { createSlice, current, type PayloadAction } from '@reduxjs/toolkit';
import {
  BackgroundType,
  DrawElements,
  DrawPoint,
  PropertyKey,
  Tool,
  TreeNode,
  ViewState
} from '@algocanvas/types/canvas';

export interface ICanvasState {
  view: ViewState;
  tool: Tool;
  size: {
    width: number;
    height: number;
  };
  elements: DrawElements[];
  selectedElementId: string | null;
  selectedElementIds: string[];
  drawingState: {
    isDrawing: boolean;
  };
  ui: {
    backgroundType: BackgroundType;
    backgroundColor: string;
  };
  showArrayDialog: boolean;
  showTreeDialog: boolean;
  showLinkedListDialog: boolean;
  history: {
    past: DrawElements[][];
    future: DrawElements[][];
  };
  clipBoard: DrawElements[];
}

const initialState: ICanvasState = {
  view: {
    scale: 1,
    offsetX: 0,
    offsetY: 0
  },
  size: {
    width: 0,
    height: 0
  },
  tool: 'selection',
  elements: [],
  selectedElementId: null,
  selectedElementIds: [],
  drawingState: {
    isDrawing: false
  },
  ui: {
    backgroundType: 'grid',
    backgroundColor: '#1a1a1a'
  },
  showArrayDialog: false,
  showTreeDialog: false,
  showLinkedListDialog: false,
  history: {
    past: [],
    future: []
  },
  clipBoard: []
};

const HISTORY_LIMIT = 50;

const saveToHistory = (state: ICanvasState) => {
  state.history.past.push(structuredClone(current(state.elements)));
  if (state.history.past.length > HISTORY_LIMIT) {
    state.history.past = state.history.past.slice(-HISTORY_LIMIT);
  }
  state.history.future = [];
};

const canvasSlice = createSlice({
  name: 'canvas',
  initialState,
  reducers: {
    handleZoom: (state, action: PayloadAction<{ delta: number }>) => {
      state.view = {
        ...state.view,
        scale: Math.max(
          0.1,
          Math.min(5, state.view.scale - action.payload.delta)
        )
      };
    },
    setCanvasSize: (
      state,
      action: PayloadAction<{ width: number; height: number }>
    ) => {
      state.size.width = action.payload.width;
      state.size.height = action.payload.height;
    },
    updateOffSet: (state, action: PayloadAction<{ x: number; y: number }>) => {
      state.view = {
        ...state.view,
        offsetX: action.payload.x,
        offsetY: action.payload.y
      };
    },
    resetView: (state) => {
      state.view = {
        scale: 1,
        offsetX: 0,
        offsetY: 0
      };
    },
    changeTool: (state, action: PayloadAction<{ tool: Tool }>) => {
      state.tool = action.payload.tool;
    },
    addElements: (
      state,
      action: PayloadAction<{ element: DrawElements; replaceIndex?: number }>
    ) => {
      saveToHistory(state);
      if (action.payload.replaceIndex !== undefined) {
        // Replace existing element at the specified index
        state.elements = state.elements.map((el, idx) =>
          idx === action.payload.replaceIndex ? action.payload.element : el
        );
      } else {
        // Add new element
        state.elements = [...state.elements, action.payload.element];
      }
    },
    clearCanvas: (state) => {
      saveToHistory(state);
      state.elements = [];
    },
    changeBackgroundType: (
      state,
      action: PayloadAction<{ type: BackgroundType }>
    ) => {
      state.ui = {
        ...state.ui,
        backgroundType: action.payload.type
      };
    },
    changeBackgroundColor: (
      state,
      action: PayloadAction<{ color: string }>
    ) => {
      state.ui = {
        ...state.ui,
        backgroundColor: action.payload.color
      };
    },
    toggleDialog: (
      state,
      { payload }: PayloadAction<{ value: DSAElement }>
    ) => {
      if (payload.value === 'array') {
        state.showArrayDialog = !state.showArrayDialog;
      } else if (payload.value === 'binary-tree') {
        state.showTreeDialog = !state.showTreeDialog;
      } else if (payload.value === 'linked-list') {
        state.showLinkedListDialog = !state.showLinkedListDialog;
      }
    },
    addSelectedElementId: (state, action: PayloadAction<string | null>) => {
      state.selectedElementId = action.payload;
    },
    addSelectedElementIds: (state, action: PayloadAction<string[]>) => {
      state.selectedElementIds = action.payload;
    },
    removeElements: (state) => {
      if (state.selectedElementId !== null) {
        saveToHistory(state);
        state.elements = state.elements.filter(
          (el) => el.id !== state.selectedElementId
        );
        state.selectedElementId = null;
      }

      if (state.selectedElementIds.length > 0) {
        saveToHistory(state);
        state.elements = state.elements.filter(
          (el) => !state.selectedElementIds.includes(el.id)
        );
        state.selectedElementIds = [];
      }
    },
    updateElementPosition: (
      state,
      action: PayloadAction<{
        x: number;
        y: number;
        offset: DrawPoint;
        isStart?: boolean;
      }>
    ) => {
      const { x, y, offset, isStart } = action.payload;
      if (isStart) {
        saveToHistory(state);
      }
      const element = state.elements.find(
        (el) => el.id === state.selectedElementId
      );
      if (!element) return;

      if (element.type === 'draw') {
        element.x = x - offset.x;
        element.y = y - offset.y;
      } else if (element.type === 'line' || element.type === 'arrow') {
        const dx = x - element.x - offset.x;
        const dy = y - element.y - offset.y;

        element.x += dx;
        element.y += dy;
        element.endX += dx;
        element.endY += dy;
      } else {
        element.x = x - offset.x;
        element.y = y - offset.y;
      }
    },
    updateElementRotation: (
      state,
      action: PayloadAction<{
        rotation: number;
        isStart?: boolean;
      }>
    ) => {
      if (action.payload.isStart) {
        saveToHistory(state);
      }
      const element = state.elements.find(
        (el) => el.id === state.selectedElementId
      );
      if (element) {
        element.rotate = action.payload.rotation;
      }
    },
    updateElementSize: (
      state,
      action: PayloadAction<{
        newBounds: { minX: number; minY: number; maxX: number; maxY: number };
        isStart?: boolean;
      }>
    ) => {
      const { newBounds, isStart } = action.payload;
      if (isStart) {
        saveToHistory(state);
      }
      const element = state.elements.find(
        (el) => el.id === state.selectedElementId
      );
      if (!element) return;

      resizeElement(element, newBounds);
    },
    undo: (state) => {
      if (state.history.past.length === 0) return;

      const previous = state.history.past.pop()!;
      state.history.future.push(structuredClone(current(state.elements)));
      state.elements = previous;

      state.selectedElementId = null;
      state.selectedElementIds = [];
    },
    redo: (state) => {
      if (state.history.future.length === 0) return;

      const next = state.history.future.pop()!;
      state.history.past.push(structuredClone(current(state.elements)));
      state.elements = next;

      state.selectedElementId = null;
      state.selectedElementIds = [];
    },
    addToClipBoard: (state) => {
      const elementsToCopy: DrawElements[] = [];
      if (state.selectedElementId !== null) {
        const element = state.elements.find(
          (el) => el.id === state.selectedElementId
        );
        if (element) {
          elementsToCopy.push(structuredClone(current(element)));
        }
      } else if (state.selectedElementIds.length > 0) {
        state.selectedElementIds.forEach((id) => {
          const element = state.elements.find((el) => el.id === id);
          if (element) {
            elementsToCopy.push(structuredClone(current(element)));
          }
        });
      }

      state.clipBoard = elementsToCopy;
    },
    pastElements: (
      state,
      action: PayloadAction<{ offsetX?: number; offsetY?: number }>
    ) => {
      const { offsetX = 20, offsetY = 20 } = action.payload;

      if (state.clipBoard.length === 0) return;

      const newIds: string[] = [];

      state.clipBoard.forEach((element) => {
        const newElement = structuredClone(current(element));
        newElement.x += offsetX;
        newElement.y += offsetY;
        // Generate new UUID for pasted element
        newElement.id = crypto.randomUUID();
        state.elements.push(newElement);
        newIds.push(newElement.id);
      });

      // Select the newly pasted elements
      if (newIds.length === 1) {
        state.selectedElementId = newIds[0]!;
        state.selectedElementIds = [];
      } else {
        state.selectedElementId = null;
        state.selectedElementIds = newIds;
      }
    },
    duplicateElements: (state) => {
      const elementsToDuplicate: DrawElements[] = [];

      if (state.selectedElementId !== null) {
        const element = state.elements.find(
          (el) => el.id === state.selectedElementId
        );
        if (element)
          elementsToDuplicate.push(structuredClone(current(element)));
      } else if (state.selectedElementIds.length > 0) {
        state.selectedElementIds.forEach((id) => {
          const element = state.elements.find((el) => el.id === id);
          if (element)
            elementsToDuplicate.push(structuredClone(current(element)));
        });
      }

      if (elementsToDuplicate.length === 0) return;

      const newIds: string[] = [];
      const offset = 20;

      elementsToDuplicate.forEach((element) => {
        const newElement = structuredClone(element);
        newElement.x += offset;
        newElement.y += offset;
        // Generate new UUID for duplicated element
        newElement.id = crypto.randomUUID();
        state.elements.push(newElement);
        newIds.push(newElement.id);
      });

      // Select the duplicated elements
      if (newIds.length === 1) {
        state.selectedElementId = newIds[0]!;
        state.selectedElementIds = [];
      } else {
        state.selectedElementId = null;
        state.selectedElementIds = newIds;
      }
    },
    updateElementProperty: (
      state,
      action: PayloadAction<{
        propertyKey: PropertyKey;
        value: string | number;
      }>
    ) => {
      const { propertyKey, value } = action.payload;
      const element = state.elements.find(
        (el) => el.id === state.selectedElementId
      );
      if (!element) return;

      saveToHistory(state);
      (element as Record<string, unknown>)[propertyKey] = value;
    },
    updateDataStructuresValues: (
      state,
      action: PayloadAction<{ value: string[] | TreeNode }>
    ) => {
      if (state.selectedElementId === null) return;

      const element = state.elements.find(
        (el) => el.id === state.selectedElementId
      );
      if (!element) return;

      saveToHistory(state);

      if (element.type === 'array') {
        element.value = action.payload.value as string[];
        return;
      }

      if (element.type === 'linked-list') {
        element.values = action.payload.value as string[];
      }

      if (element.type === 'binary-tree') {
        element.root = action.payload.value as TreeNode;
      }
    }
  }
});

export const {
  handleZoom,
  updateOffSet,
  resetView,
  setCanvasSize,
  changeTool,
  addElements,
  clearCanvas,
  changeBackgroundColor,
  changeBackgroundType,
  toggleDialog,
  addSelectedElementIds,
  addSelectedElementId,
  removeElements,
  updateElementPosition,
  updateElementRotation,
  updateElementSize,
  undo,
  redo,
  addToClipBoard,
  pastElements,
  duplicateElements,
  updateElementProperty,
  updateDataStructuresValues
} = canvasSlice.actions;

export default canvasSlice.reducer;
