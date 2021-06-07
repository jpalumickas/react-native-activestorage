export type FileMetadata = { [key: string]: any };

export interface File {
  name: string;
  size: number;
  type: string;
  path: string;
  metadata?: FileMetadata;
}

export type DirectUploadTaskStatus =
  | 'success'
  | 'uploading'
  | 'error'
  | 'waiting'
  | 'canceled';

export interface DirectUploadTask {
  id: number;
  file: File;
  cancel: () => void;
}

export interface DirectUploadTaskError extends DirectUploadTask {
  status: 'error';
  error: Error;
}

export interface DirectUploadTaskSuccess extends DirectUploadTask {
  status: 'success';
}

export interface DirectUploadTaskWaiting extends DirectUploadTask {
  status: 'waiting';
}

export interface DirectUploadTaskCanceled extends DirectUploadTask {
  status: 'canceled';
}

export interface DirectUploadTaskUploading extends DirectUploadTask {
  status: 'uploading';
  progress: number;
  totalBytes: number;
  uploadedBytes: number;
}

export type DirectUploadTaskResponse =
  | DirectUploadTaskError
  | DirectUploadTaskSuccess
  | DirectUploadTaskWaiting
  | DirectUploadTaskCanceled
  | DirectUploadTaskUploading;

type WithoutDirectUploadParams<T> = Omit<T, 'id' | 'cancel' | 'file'>;

export type HandleStatusUpdateData =
  | WithoutDirectUploadParams<DirectUploadTaskError>
  | WithoutDirectUploadParams<DirectUploadTaskUploading>
  | WithoutDirectUploadParams<DirectUploadTaskWaiting>
  | WithoutDirectUploadParams<DirectUploadTaskCanceled>
  | WithoutDirectUploadParams<DirectUploadTaskSuccess>;
