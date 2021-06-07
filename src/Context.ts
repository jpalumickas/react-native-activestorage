import { createContext } from 'react';

const defaultContext = {
  host: 'http://localhost:3000',
  mountPath: '/rails/active_storage'
};

export const Context = createContext(defaultContext);
export const { Consumer, Provider } = Context;

export default Context;
