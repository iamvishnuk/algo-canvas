import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import {
  StrokeableProps,
  FillableProps,
  PathProps,
  TextProps,
  PropertyKey
} from '@algocanvas/types/canvas';

export interface IElementPropertyState {
  line: StrokeableProps;
  rectangle: StrokeableProps & FillableProps;
  circle: StrokeableProps & FillableProps;
  arrow: StrokeableProps & FillableProps;
  draw: PathProps;
  text: TextProps;
}

const initialState: IElementPropertyState = {
  line: {
    rotate: 0,
    strokeStyle: '#7A3EFF',
    lineWidth: 2,
    strokePattern: 'solid'
  },
  rectangle: {
    rotate: 0,
    strokeStyle: '#7A3EFF',
    lineWidth: 2,
    fillStyle: 'transparent',
    strokePattern: 'solid'
  },
  circle: {
    rotate: 0,
    strokeStyle: '#7A3EFF',
    lineWidth: 2,
    fillStyle: 'transparent',
    strokePattern: 'solid'
  },
  text: {
    fontSize: 28,
    fontFamily: 'Caveat',
    rotate: 0,
    color: '#7A3EFF'
  },
  arrow: {
    rotate: 0,
    strokeStyle: '#7A3EFF',
    lineWidth: 2,
    fillStyle: 'transparent',
    strokePattern: 'solid'
  },
  draw: {
    rotate: 0,
    lineWidth: 2,
    strokeStyle: '#7A3EFF',
    lineCap: 'round' as CanvasLineCap,
    lineJoin: 'round' as CanvasLineJoin,
    strokePattern: 'solid'
  }
};

const elementPropertySlice = createSlice({
  name: 'elementProperty',
  initialState,
  reducers: {
    updateElementDefaultProperty: (
      state,
      action: PayloadAction<{
        element: keyof IElementPropertyState;
        key: PropertyKey;
        value: string | number;
      }>
    ) => {
      const { element, key, value } = action.payload;
      const elementState = state[element];
      if (elementState && key in elementState) {
        (elementState as Record<string, unknown>)[key] = value;
      }
    }
  }
});

export const { updateElementDefaultProperty } = elementPropertySlice.actions;

export default elementPropertySlice.reducer;
