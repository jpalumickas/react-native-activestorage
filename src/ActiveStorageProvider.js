import React from 'react';
import { Provider } from './Context';

const ActiveStorageProvider = ({ host, mountPath, children }) => (
  <Provider value={{ host, mountPath }}>{children}</Provider>
);

export default ActiveStorageProvider;
