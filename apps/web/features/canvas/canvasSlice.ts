import { DSAElement } from '@/lib/canvas/constant';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import {
  BackgroundType,
  DrawElements,
  DrawPoint,
  Tool,
  ViewState
} from '@workspace/types/canvas';
import { select } from 'motion/react-m';

export interface ICanvasState {
  view: ViewState;
  tool: Tool;
  size: {
    width: number;
    height: number;
  };
  elements: DrawElements[];
  selectedElementIndex: number | null;
  selectedElementsIndice: number[];
  drawingState: {
    isDrawing: boolean;
  };
  ui: {
    backgroudType: BackgroundType;
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
  selectedElementsIndice: [],
  drawingState: {
    isDrawing: false
  },
  ui: {
    backgroudType: 'grid',
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
    changeBackgroudType: (
      state,
      action: PayloadAction<{ type: BackgroundType }>
    ) => {
      state.ui = {
        ...state.ui,
        backgroudType: action.payload.type
      };
    },
    changeBackgroudColor: (state, action: PayloadAction<{ color: string }>) => {
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
    addSelectedEleementIndex: (state, action: PayloadAction<number | null>) => {
      state.selectedElementIndex = action.payload;
    },
    addselectedElementsIndice: (state, action: PayloadAction<number[]>) => {
      state.selectedElementsIndice = action.payload;
    },
    removeElements: (state) => {
      if (state.selectedElementIndex !== null) {
        state.elements = state.elements.filter(
          (_, index) => index !== state.selectedElementIndex
        );
        state.selectedElementIndex = null;
      }

      if (state.selectedElementsIndice.length > 0) {
        state.elements = state.elements.filter(
          (_, index) => !state.selectedElementsIndice.includes(index)
        );

        state.selectedElementsIndice = [];
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
      console.log('this called');
      const { index, x, y, offset } = action.payload;

      if (!state.elements[index]) return;

      if (state.elements[index].type === 'rectangle') {
        state.elements[index].x = x - offset.x;
        state.elements[index].y = y - offset.y;
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
  changeBackgroudColor,
  changeBackgroudType,
  toggleDialog,
  addselectedElementsIndice,
  addSelectedEleementIndex,
  removeElements,
  updateElementPosition
} = canvasSlice.actions;

export default canvasSlice.reducer;
