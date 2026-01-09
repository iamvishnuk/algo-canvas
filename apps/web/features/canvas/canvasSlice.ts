import { DSAElement } from '@/lib/canvas/constant';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import {
  BackgroundType,
  DrawElements,
  DrawPoint,
  Tool,
  ViewState
} from '@workspace/types/canvas';

export interface ICanvasState {
  view: ViewState;
  tool: Tool;
  size: {
    width: number;
    height: number;
  };
  elements: DrawElements[];
  selectedElementIndex: number | null;
  selectedElementsIndices: number[];
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
  selectedElementIndex: null,
  selectedElementsIndices: [],
  drawingState: {
    isDrawing: false
  },
  ui: {
    backgroundType: 'grid',
    backgroundColor: '#1a1a1a'
  },
  showArrayDialog: false,
  showTreeDialog: false,
  showLinkedListDialog: false
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
    addElements: (state, action: PayloadAction<{ element: DrawElements }>) => {
      state.elements = [...state.elements, action.payload.element];
    },
    clearCanvas: (state) => {
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
    addSelectedElementIndex: (state, action: PayloadAction<number | null>) => {
      state.selectedElementIndex = action.payload;
    },
    addSelectedElementsIndices: (state, action: PayloadAction<number[]>) => {
      state.selectedElementsIndices = action.payload;
    },
    removeElements: (state) => {
      if (state.selectedElementIndex !== null) {
        state.elements = state.elements.filter(
          (_, index) => index !== state.selectedElementIndex
        );
        state.selectedElementIndex = null;
      }

      if (state.selectedElementsIndices.length > 0) {
        state.elements = state.elements.filter(
          (_, index) => !state.selectedElementsIndices.includes(index)
        );

        state.selectedElementsIndices = [];
      }
    },
    updateElementPosition: (
      state,
      action: PayloadAction<{
        index: number;
        x: number;
        y: number;
        offset: DrawPoint;
      }>
    ) => {
      const { index, x, y, offset } = action.payload;
      const element = state.elements[index];
      if (!element) return;

      if (element.type === 'draw') {
        // Only move the anchor
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
  addSelectedElementsIndices,
  addSelectedElementIndex,
  removeElements,
  updateElementPosition
} = canvasSlice.actions;

export default canvasSlice.reducer;
