import type { BackendPageResult } from './adapters/page';
import { adaptBackendPage, toBackendPageParams } from './adapters/page';
import { request } from '../request';
import { SYSTEM_MODULE_URLS } from '../urls/system-module';

type UserSearchParams = Api.SystemModule.UserSearchParams;

/** 用户分页列表 */
export async function fetchGetUserList(params?: UserSearchParams) {
  const page = await request<BackendPageResult<Api.SystemModule.User>>({
    method: 'get',
    params: toBackendPageParams(params),
    url: SYSTEM_MODULE_URLS.USER_LIST
  });

  return adaptBackendPage(page, params ?? {});
}
/** 用户详情 */
export function fetchGetUserDetail(id: number) {
  return request<Api.SystemModule.User>({
    method: 'get',
    url: SYSTEM_MODULE_URLS.USER_DETAIL(id)
  });
}

/** 创建用户 */
export function fetchCreateUser(data: Api.SystemModule.UserForm) {
  return request<Api.SystemModule.User>({
    data,
    method: 'post',
    url: SYSTEM_MODULE_URLS.USER_CREATE
  });
}

/** 更新用户 */
export function fetchUpdateUser(id: number, data: Api.SystemModule.UserForm) {
  return request<Api.SystemModule.User>({
    data,
    method: 'put',
    url: SYSTEM_MODULE_URLS.USER_UPDATE(id)
  });
}

/** 删除用户（支持批量） */
export function fetchDeleteUser(ids: number[]) {
  return request<null>({
    data: ids,
    method: 'delete',
    url: SYSTEM_MODULE_URLS.USER_DELETE
  });
}

/** 批量修改用户状态 */
export function fetchBatchSetUserStatus(data: Api.SystemModule.BatchSetAvailable) {
  return request<null>({
    data,
    method: 'patch',
    url: SYSTEM_MODULE_URLS.USER_BATCH_STATUS
  });
}

/** 当前用户详情（个人中心） */
export function fetchGetCurrentUserProfile() {
  return request<Api.SystemModule.CurrentUserProfile>({
    method: 'get',
    url: SYSTEM_MODULE_URLS.USER_CURRENT_INFO
  });
}

/** 更新当前用户资料 */
export function fetchUpdateCurrentUserProfile(data: Api.SystemModule.CurrentUserProfileForm) {
  return request<Api.SystemModule.CurrentUserProfile>({
    data,
    method: 'put',
    url: SYSTEM_MODULE_URLS.USER_CURRENT_UPDATE
  });
}

/** 上传当前用户头像 */
export function fetchUploadCurrentUserAvatar(file: File) {
  const formData = new FormData();
  formData.append('file', file);

  return request<{ file_url: string }>({
    data: formData,
    headers: { 'Content-Type': 'multipart/form-data' },
    method: 'post',
    url: SYSTEM_MODULE_URLS.USER_CURRENT_AVATAR_UPLOAD
  });
}

/** 修改当前用户密码 */
export function fetchChangeCurrentUserPassword(data: Api.SystemModule.ChangePasswordForm) {
  return request<null>({
    data,
    method: 'put',
    url: SYSTEM_MODULE_URLS.USER_CURRENT_PASSWORD_CHANGE
  });
}
