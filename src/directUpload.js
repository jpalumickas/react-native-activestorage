import RNFetchBlob from 'rn-fetch-blob';
import createBlobRecord from './createBlobRecord';

let id = 0

export default ({ directUploadsUrl, file }, onStatusChange) => {
  const taskId = ++id;
  let canceled = false;
  let task;

  const handleCancel = () => {
    if (!task) { return; }

    canceled = true;
    task.cancel();
  }

  const handleStatusUpdate = (data) => {
    onStatusChange({ ...data, id: taskId, cancel: handleCancel, file });
  }

  handleStatusUpdate({ status: 'waiting' });

  return new Promise(async (resolve, reject) => {
    const blobData = await createBlobRecord({ directUploadsUrl, file });
    const { url, headers } = blobData.direct_upload;

    const fileData = RNFetchBlob.wrap(file.path);

    task = RNFetchBlob.fetch('PUT', url, headers, fileData)

    task
      .uploadProgress({ interval: 250 }, (loaded, total) => {
        const progress = (loaded / total) * 100
        handleStatusUpdate({ status: 'progress', progress });
      })
      .then((resp) => {
        const status = resp.info().status;
        if (status >= 200 && status < 400) {
          handleStatusUpdate({ status: 'finished' });
        } else {
          handleStatusUpdate({ status: 'error' });
        }

        resolve(blobData.signed_id)
      })
      .catch((err) => {
        if (canceled) {
          handleStatusUpdate({ status: 'canceled' });
        } else {
          handleStatusUpdate({ status: 'error' });
        }

        resolve()
      })
  })
}
