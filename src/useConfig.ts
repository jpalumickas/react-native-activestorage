import { useContext } from 'react';
import Context from './Context';

const useConfig = () => {
  const config = useContext(Context);
  const mountPath = config.mountPath || '/rails/active_storage';

  const url = `${config.host}${mountPath}`;

  return {
    ...config,
    mountPath,
    directUploadsUrl: `${url}/direct_uploads`,
  }
}


export default useConfig;
