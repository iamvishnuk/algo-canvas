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
  elements: DrawElements[];
  drawingState: {
    isDrawing: boolean;
  };
  ui: {
    backgroudType: BackgroundType;
    backgroundColor: string;
  };
}

const initialState: ICanvasState = {
  view: {
    scale: 1,
    offsetX: 0,
    offsetY: 0
  },
  tool: 'selection',
  elements: [],
  drawingState: {
    isDrawing: false
  },
  ui: {
    backgroudType: 'grid',
    backgroundColor: '#1a1a1a'
  }
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
    }
  }
});

export const {
  handleZoom,
  updateOffSet,
  resetView,
  changeTool,
  addElements,
  clearCanvas,
  changeBackgroudColor,
  changeBackgroudType
} = canvasSlice.actions;

export default canvasSlice.reducer;
