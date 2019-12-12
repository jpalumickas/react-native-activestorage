import getChecksum from './checksum';

export default async ({ directUploadsUrl = '/rails/active_storage/direct_uploads', file }) => {
  const checksum = await getChecksum({ path: file.path });

  const params = {
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
    headers: { 'Content-Type': 'application/json' },
  });

  return response.json();
}
