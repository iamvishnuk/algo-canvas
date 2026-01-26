import { DSAElement } from '@/lib/canvas/config';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { BackgroundType, Tool } from '@algocanvas/types/canvas';

export interface ICanvasState {
  tool: Tool;
  ui: {
    backgroundType: BackgroundType;
    backgroundColor: string;
  };
  showArrayDialog: boolean;
  showTreeDialog: boolean;
  showLinkedListDialog: boolean;
}

const initialState: ICanvasState = {
  tool: 'selection',
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
    changeTool: (state, action: PayloadAction<{ tool: Tool }>) => {
      state.tool = action.payload.tool;
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
    }
  }
});

export const {
  changeTool,
  changeBackgroundColor,
  changeBackgroundType,
  toggleDialog
} = canvasSlice.actions;

export default canvasSlice.reducer;
