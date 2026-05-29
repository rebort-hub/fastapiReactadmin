import type { BackendPageResult } from './adapters/page';
import { adaptBackendPage, toBackendPageParams } from './adapters/page';
import { request } from '../request';
import { SYSTEM_MODULE_URLS } from '../urls/system-module';

type OnlineSearchParams = Api.SystemModule.OnlineSearchParams;

/** 在线用户分页列表 */
export async function fetchGetOnlineUserList(params?: OnlineSearchParams) {
  const page = await request<BackendPageResult<Api.SystemModule.OnlineUser>>({
    method: 'get',
    params: toBackendPageParams(params),
    url: SYSTEM_MODULE_URLS.ONLINE_LIST
  });

  return adaptBackendPage(page, params ?? {});
}

/** 强制下线 */
export function fetchKickOnlineUser(sessionId: string) {
  return request<null>({
    data: JSON.stringify(sessionId),
    headers: { 'Content-Type': 'application/json' },
    method: 'delete',
    url: SYSTEM_MODULE_URLS.ONLINE_DELETE
  });
}

/** 强退所有在线用户 */
export function fetchClearOnlineUsers() {
  return request<null>({
    method: 'delete',
    url: SYSTEM_MODULE_URLS.ONLINE_CLEAR
  });
}
