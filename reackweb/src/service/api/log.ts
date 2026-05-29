import type { BackendPageResult } from './adapters/page';
import { adaptBackendPage, toBackendPageParams } from './adapters/page';
import { request } from '../request';
import { SYSTEM_MODULE_URLS } from '../urls/system-module';

type LogSearchParams = Api.SystemModule.LogSearchParams;

/** 日志分页列表 */
export async function fetchGetLogList(params?: LogSearchParams) {
  const page = await request<BackendPageResult<Api.SystemModule.Log>>({
    method: 'get',
    params: toBackendPageParams(params),
    url: SYSTEM_MODULE_URLS.LOG_LIST
  });

  return adaptBackendPage(page, params ?? {});
}

/** 日志详情 */
export function fetchGetLogDetail(id: number) {
  return request<Api.SystemModule.Log>({
    method: 'get',
    url: SYSTEM_MODULE_URLS.LOG_DETAIL(id)
  });
}

/** 删除日志（支持批量） */
export function fetchDeleteLog(ids: number[]) {
  return request<null>({
    data: ids,
    method: 'delete',
    url: SYSTEM_MODULE_URLS.LOG_DELETE
  });
}
