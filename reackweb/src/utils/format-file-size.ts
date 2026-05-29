export function formatFileSize(size?: number | null) {
  if (size === null || size === undefined) {
    return '—';
  }

  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let unitIndex = 0;
  let fileSize = size;

  while (fileSize >= 1024 && unitIndex < units.length - 1) {
    fileSize /= 1024;
    unitIndex += 1;
  }

  return `${fileSize.toFixed(1)} ${units[unitIndex]}`;
}
