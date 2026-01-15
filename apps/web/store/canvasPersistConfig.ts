import storage from 'redux-persist/lib/storage';

export const canvasPersistConfig = {
  key: 'algocanvas-canvas',
  storage,
  whitelist: ['elements']
};
