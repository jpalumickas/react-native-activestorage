import getChecksum from './checksum';
import { File } from '../types';

interface CreateBlobRecordParams {
  directUploadsUrl: string;
  file: File;
  headers?: object;
}

interface BlobParams {
  filename: string;
  content_type: string;
  byte_size: number;
  checksum: string;
  metadata?: object;
}

const createBlobRecord = async ({ directUploadsUrl, file, headers = {} }: CreateBlobRecordParams) => {
  const checksum = await getChecksum({ path: file.path });

  if (!checksum) {
    throw new Error(`Failed to get file checksum. Path: ${file.path}`)
  }

  const params: BlobParams = {
    filename: file.name,
    content_type: file.type || 'image/jpeg',
    byte_size: file.size,
    checksum,
  }

  if (file.metadata) {
    params.metadata = file.metadata;
  }

  const response = await fetch(directUploadsUrl, {
    method: 'POST',
    body: JSON.stringify({ blob: params }),
    headers: { 'Content-Type': 'application/json', ...headers },
  });

  return response.json();
}

export default createBlobRecord;
