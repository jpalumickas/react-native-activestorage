import React from 'react';
import { Provider } from './Context';

const ActiveStorageProvider = ({ url, mountPath }) => (
  <Provider value={{ url, mountPath }}>{children}</Provider>
);

export default ActiveStorageProvider;
