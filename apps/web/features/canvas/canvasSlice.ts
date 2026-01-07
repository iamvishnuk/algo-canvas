import { DSAElement } from '@/lib/canvas/constant';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import {
  BackgroundType,
  DrawElements,
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
  drawingState: {
    isDrawing: boolean;
  };
  ui: {
    backgroudType: BackgroundType;
    backgroundColor: string;
  };
  showArrayDialog: boolean;
  showTreeDialog: boolean;
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
  drawingState: {
    isDrawing: false
  },
  ui: {
    backgroudType: 'grid',
    backgroundColor: '#1a1a1a'
  },
  showArrayDialog: false,
  showTreeDialog: false
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
  toggleDialog
} = canvasSlice.actions;

export default canvasSlice.reducer;
