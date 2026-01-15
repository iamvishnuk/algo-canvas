import { combineReducers } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import { canvasPersistConfig } from './canvasPersistConfig';

import canvasReducer from '../features/canvas/canvasSlice';
import elementPropertyReducer from '../features/element/elementPropertySlice';

const rootReducer = combineReducers({
  canvas: persistReducer(canvasPersistConfig, canvasReducer),
  elementProperty: elementPropertyReducer
});

export default rootReducer;
