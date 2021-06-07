import { useMemo, useState, useCallback } from 'react';
import directUpload from './lib/directUpload';
import insertOrReplace from './lib/insertOrReplace';
import useConfig from './useConfig';

const useDirectUpload = ({ onSuccess }) => {
  const { directUploadsUrl } = useConfig();
  const [uploads, setUploads] = useState([]);

  const handleFileUploadChange = useCallback((fileUpload) => {
    setUploads((fileUploads) => insertOrReplace(fileUploads, fileUpload));
  }, []);

  const upload = useCallback(
    async (files) => {
      const signedIds = await Promise.all(
        files.map((file) =>
          directUpload({ file, directUploadsUrl }, handleFileUploadChange)
        )
      );

      const validIds = signedIds.filter((it) => it);
      if (validIds.length > 0) {
        onSuccess({ signedIds: validIds });
      }

      return { signedIds: validIds }
    },
    [handleFileUploadChange, onSuccess]
  );

  const uploading = useMemo(() => uploads.some((upload) => upload.status === 'uploading'), [uploads]);

  return {
    upload,
    uploads,
    uploading,
  };
};

export default useDirectUpload;
