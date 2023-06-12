import ReactNativeBlobUtil, { FetchBlobResponse, StatefulPromise } from 'react-native-blob-util';
import createBlobRecord from './createBlobRecord';
import { File, DirectUploadResult, HandleStatusUpdateData } from '../types';

let id = 0;

interface DirectUploadParams {
  directUploadsUrl: string;
  file: File;
  headers?: object;
  onStatusChange: (data: DirectUploadResult) => void;
}

const directUpload = ({ directUploadsUrl, file, headers, onStatusChange }: DirectUploadParams) => {
  const taskId = ++id;
  let canceled = false;
  let task: StatefulPromise<FetchBlobResponse>;

  const handleCancel = () => {
    if (!task) {
      return;
    }

    canceled = true;
    task.cancel();
  };

  const handleStatusUpdate = (data: HandleStatusUpdateData) => {
    onStatusChange({ ...data, id: taskId, cancel: handleCancel, file });
  };

  handleStatusUpdate({ status: 'waiting' });

  return new Promise<string | void>(async (resolve) => {
    try {
      const blobData = await createBlobRecord({
        directUploadsUrl,
        file,
        headers,
      });

      const { url, headers: uploadHeaders } = blobData.direct_upload;

      const fileData = ReactNativeBlobUtil.wrap(file.path);

      task = ReactNativeBlobUtil.fetch('PUT', url, uploadHeaders, fileData);

      task
        .uploadProgress({ interval: 250 }, (uploadedBytes, totalBytes) => {
          const progress = (uploadedBytes / totalBytes) * 100;
          handleStatusUpdate({ status: 'uploading', progress, totalBytes, uploadedBytes });
        })
        .then((resp) => {
          const status = resp.info().status;
          if (status >= 200 && status < 400) {
            handleStatusUpdate({ status: 'success' });
          } else {
            handleStatusUpdate({ status: 'error', error: new Error('Response not success') });
          }

          resolve(blobData.signed_id);
        })
        .catch((err) => {
          if (canceled) {
            handleStatusUpdate({ status: 'canceled' });
          } else {
            handleStatusUpdate({ status: 'error', error: err });
          }

          resolve();
        });
    } catch (err: any) {
      handleStatusUpdate({ status: 'error', error: err });
      return resolve();
    }
  });
};

export default directUpload;
