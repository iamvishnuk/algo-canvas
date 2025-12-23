import { combineReducers } from '@reduxjs/toolkit';

import canvasReducer from '../features/canvas/canvasSlice';

const rootReducer = combineReducers({
  canvas: canvasReducer
});

export default rootReducer;
