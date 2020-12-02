import RNFetchBlob from 'rn-fetch-blob';
import createBlobRecord from './createBlobRecord';

let id = 0

export default ({ directUploadsUrl, file, headers, callbackFun }, onStatusChange) => {
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
    const blobData = await createBlobRecord({ directUploadsUrl, file, headers });
    callbackFun&&callbackFun(blobData)
    const { url, headers: uploadHeaders } = blobData.direct_upload;

    const fileData = RNFetchBlob.wrap(file.path);

    task = RNFetchBlob.fetch('PUT', url, uploadHeaders, fileData)

    task
      .uploadProgress({ interval: 250 }, (count, total) => {
        const progress = (count / total) * 100
        handleStatusUpdate({ status: 'progress', progress, total, count });
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
