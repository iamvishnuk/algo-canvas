'use client';

import { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { store, persistor } from './store';
import { PersistGate } from 'redux-persist/integration/react';

type ReduxProviderProps = {
  children: ReactNode;
};

const ReduxProvider = ({ children }: ReduxProviderProps) => {
  return (
    <Provider store={store}>
      <PersistGate
        persistor={persistor}
        loading={null}
      >
        {children}
      </PersistGate>
    </Provider>
  );
};

export default ReduxProvider;
