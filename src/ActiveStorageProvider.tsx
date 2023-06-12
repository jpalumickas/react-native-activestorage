import React, { ReactNode } from 'react';
import { Provider } from './Context';

type Props = {
  host: string;
  mountPath?: string;
  children: ReactNode
}

const ActiveStorageProvider: React.FC<Props> = ({ host, mountPath, children }) => (
  <Provider value={{ host, mountPath }}>{children}</Provider>
);

export default ActiveStorageProvider;
