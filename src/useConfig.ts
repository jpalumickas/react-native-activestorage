import { useContext } from 'react';
import Context from './Context';

const useConfig = () => {
  const config = useContext(Context);

  const url = `${config.host}${config.mountPath}`;

  return {
    ...config,
    directUploadsUrl: `${url}/direct_uploads`,
  }
}


export default useConfig;
