import { useMemo, useState, useCallback } from 'react';
import directUpload from './lib/directUpload';
import useConfig from './useConfig';

const useDirectUpload = ({ onSuccess }) => {
  const { directUploadsUrl } = useConfig();
  const [uploads, setUploads] = useState([]);

  const handleFileUploadChange = useCallback((fileUpload) => {
    const newObj = { [fileUpload.id]: fileUpload };
    setUploads((fileUploads) => ({
      fileUploads: { ...fileUploads, ...newObj },
    }));
  }, []);

  const upload = useCallback(
    async (files) => {
      console.log(files);
      const signedIds = await Promise.all(
        files.map((file) =>
          directUpload({ file, directUploadsUrl }, handleFileUploadChange)
        )
      );

      const validIds = signedIds.filter((it) => it);
      if (validIds.length > 0) {
        onSuccess({ signedIds: validIds });
      }
    },
    [handleFileUploadChange, onSuccess]
  );

  const uploading = useMemo(() => !!uploads.find((upload) => upload.status === 'uploading'), [uploads]);

  return {
    upload,
    uploads,
    uploading,
  };
};

export default useDirectUpload;
