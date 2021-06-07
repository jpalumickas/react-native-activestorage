import RNFetchBlob, { FetchBlobResponse, StatefulPromise } from 'rn-fetch-blob';
import createBlobRecord from './createBlobRecord';
import { File, DirectUploadTaskResponse, HandleStatusUpdateData } from '../types';

let id = 0;

interface DirectUploadParams {
  directUploadsUrl: string;
  file: File;
  headers?: object;
}

const directUpload = ({ directUploadsUrl, file, headers }: DirectUploadParams, onStatusChange: (data: DirectUploadTaskResponse) => void) => {
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

  return new Promise<void>(async (resolve) => {
    try {
      const blobData = await createBlobRecord({
        directUploadsUrl,
        file,
        headers,
      });

      const { url, headers: uploadHeaders } = blobData.direct_upload;

      const fileData = RNFetchBlob.wrap(file.path);

      task = RNFetchBlob.fetch('PUT', url, uploadHeaders, fileData);

      task
        .uploadProgress({ interval: 250 }, (count, total) => {
          const progress = (count / total) * 100;
          handleStatusUpdate({ status: 'uploading', progress, total, count });
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
    } catch (err) {
      handleStatusUpdate({ status: 'error', error: err });
      return resolve();
    }
  });
};

export default directUpload;
