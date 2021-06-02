import useDirectUpload from './useDirectUpload';

const DirectUpload = ({ children, onSuccess }) => {
  const { upload, uploads, uploading } = useDirectUpload({ onSuccess });

  return children({
    upload,
    uploading,
    uploads,
  })
}

export default DirectUpload;
