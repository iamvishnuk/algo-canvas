import { combineReducers } from '@reduxjs/toolkit';

import canvasReducer from '../features/canvas/canvasSlice';
import elementPropertyReducer from '../features/element/elementPropertySlice';

const rootReducer = combineReducers({
  canvas: canvasReducer,
  elementProperty: elementPropertyReducer
});

export default rootReducer;
