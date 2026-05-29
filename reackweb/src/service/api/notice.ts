import type { BackendPageResult } from './adapters/page';
import { adaptBackendPage, toBackendPageParams } from './adapters/page';
import { request } from '../request';
import { SYSTEM_MODULE_URLS } from '../urls/system-module';

type NoticeSearchParams = Api.SystemModule.NoticeSearchParams;

/** 公告分页列表 */
export async function fetchGetNoticeList(params?: NoticeSearchParams) {
  const page = await request<BackendPageResult<Api.SystemModule.Notice>>({
    method: 'get',
    params: toBackendPageParams(params),
    url: SYSTEM_MODULE_URLS.NOTICE_LIST
  });

  return adaptBackendPage(page, params ?? {});
}

/** 公告详情 */
export function fetchGetNoticeDetail(id: number) {
  return request<Api.SystemModule.Notice>({
    method: 'get',
    url: SYSTEM_MODULE_URLS.NOTICE_DETAIL(id)
  });
}

/** 创建公告 */
export function fetchCreateNotice(data: Api.SystemModule.NoticeForm) {
  return request<Api.SystemModule.Notice>({
    data,
    method: 'post',
    url: SYSTEM_MODULE_URLS.NOTICE_CREATE
  });
}

/** 更新公告 */
export function fetchUpdateNotice(id: number, data: Api.SystemModule.NoticeForm) {
  return request<Api.SystemModule.Notice>({
    data,
    method: 'put',
    url: SYSTEM_MODULE_URLS.NOTICE_UPDATE(id)
  });
}

/** 删除公告（支持批量） */
export function fetchDeleteNotice(ids: number[]) {
  return request<null>({
    data: ids,
    method: 'delete',
    url: SYSTEM_MODULE_URLS.NOTICE_DELETE
  });
}

/** 批量修改公告状态 */
export function fetchBatchSetNoticeStatus(data: Api.SystemModule.BatchSetAvailable) {
  return request<null>({
    data,
    method: 'patch',
    url: SYSTEM_MODULE_URLS.NOTICE_BATCH_STATUS
  });
}

/** 首页已启用公告（固定第 1 页、每页 10 条） */
export async function fetchGetNoticeAvailable() {
  const page = await request<BackendPageResult<Api.SystemModule.Notice>>({
    method: 'get',
    url: SYSTEM_MODULE_URLS.NOTICE_AVAILABLE
  });

  return adaptBackendPage(page, { current: 1, size: 50 });
}
