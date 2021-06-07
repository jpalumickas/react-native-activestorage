import React from 'react';
import { Provider } from './Context';

type Props = {
  host: string;
  mountPath?: string;
}

const ActiveStorageProvider: React.FC<Props> = ({ host, mountPath, children }) => (
  <Provider value={{ host, mountPath }}>{children}</Provider>
);

export default ActiveStorageProvider;
