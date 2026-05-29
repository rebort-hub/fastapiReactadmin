import type { BackendPageResult } from './adapters/page';
import { adaptBackendPage, toBackendPageParams } from './adapters/page';
import { request } from '../request';
import { SYSTEM_MODULE_URLS } from '../urls/system-module';

type ResourceSearchParams = Api.SystemModule.ResourceSearchParams;

/** 资源分页列表 */
export async function fetchGetResourceList(params?: ResourceSearchParams) {
  const page = await request<BackendPageResult<Api.SystemModule.Resource>>({
    method: 'get',
    params: toBackendPageParams(params),
    url: SYSTEM_MODULE_URLS.RESOURCE_LIST
  });

  return adaptBackendPage(page, params ?? {});
}

/** 上传文件 */
export function fetchUploadResource(file: File, targetPath?: string) {
  const formData = new FormData();
  formData.append('file', file);
  if (targetPath) {
    formData.append('target_path', targetPath);
  }

  return request<Record<string, unknown>>({
    data: formData,
    headers: { 'Content-Type': 'multipart/form-data' },
    method: 'post',
    url: SYSTEM_MODULE_URLS.RESOURCE_UPLOAD
  });
}

/** 下载文件 */
export function fetchDownloadResource(path: string) {
  return request<Blob, 'blob'>({
    method: 'get',
    params: { path },
    responseType: 'blob',
    url: SYSTEM_MODULE_URLS.RESOURCE_DOWNLOAD
  });
}

/** 删除文件或目录 */
export function fetchDeleteResource(paths: string[]) {
  return request<null>({
    data: paths,
    method: 'delete',
    url: SYSTEM_MODULE_URLS.RESOURCE_DELETE
  });
}

/** 移动文件或目录 */
export function fetchMoveResource(data: Api.SystemModule.ResourceMoveForm) {
  return request<null>({
    data,
    method: 'post',
    url: SYSTEM_MODULE_URLS.RESOURCE_MOVE
  });
}

/** 复制文件或目录 */
export function fetchCopyResource(data: Api.SystemModule.ResourceMoveForm) {
  return request<null>({
    data,
    method: 'post',
    url: SYSTEM_MODULE_URLS.RESOURCE_COPY
  });
}

/** 重命名文件或目录 */
export function fetchRenameResource(data: Api.SystemModule.ResourceRenameForm) {
  return request<null>({
    data,
    method: 'post',
    url: SYSTEM_MODULE_URLS.RESOURCE_RENAME
  });
}

/** 创建目录 */
export function fetchCreateResourceDir(data: Api.SystemModule.ResourceCreateDirForm) {
  return request<null>({
    data,
    method: 'post',
    url: SYSTEM_MODULE_URLS.RESOURCE_CREATE_DIR
  });
}

/** 导出资源列表 */
export function fetchExportResource(params?: ResourceSearchParams) {
  const { current: _current, size: _size, ...search } = params ?? {};

  return request<Blob, 'blob'>({
    method: 'post',
    params: toBackendPageParams(search),
    responseType: 'blob',
    url: SYSTEM_MODULE_URLS.RESOURCE_EXPORT
  });
}

function getResourceBaseName(fileUrl: string) {
  const normalized = fileUrl.split('?')[0] ?? fileUrl;
  const parts = normalized.split('/').filter(Boolean);
  return parts.at(-1) ?? fileUrl;
}

/** 构建移动/复制目标路径（相对 upload 根目录） */
export function buildResourceTargetPath(sourceUrl: string, targetDir: string) {
  const name = getResourceBaseName(sourceUrl);
  const dir = targetDir.replace(/^\/+|\/+$/g, '');
  return dir ? `${dir}/${name}` : name;
}
