import { createContext } from 'react';

type ContextType = {
  host: string;
  mountPath?: string;
}

const defaultContext = {
  host: 'http://localhost:3000',
  mountPath: '/rails/active_storage'
};

export const Context = createContext<ContextType>(defaultContext);
export const { Consumer, Provider } = Context;

export default Context;
