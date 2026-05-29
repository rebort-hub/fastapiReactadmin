import type { BackendPageResult } from './adapters/page';
import { adaptBackendPage, fetchAllBackendPages, toBackendPageParams } from './adapters/page';
import { request } from '../request';
import { SYSTEM_MODULE_URLS } from '../urls/system-module';

type PositionSearchParams = Api.SystemModule.PositionSearchParams;

/** 岗位分页列表 */
export async function fetchGetPositionList(params?: PositionSearchParams) {
  const page = await request<BackendPageResult<Api.SystemModule.Position>>({
    method: 'get',
    params: toBackendPageParams(params),
    url: SYSTEM_MODULE_URLS.POSITION_LIST
  });

  return adaptBackendPage(page, params ?? {});
}

/** 岗位详情 */
export function fetchGetPositionDetail(id: number) {
  return request<Api.SystemModule.Position>({
    method: 'get',
    url: SYSTEM_MODULE_URLS.POSITION_DETAIL(id)
  });
}

/** 创建岗位 */
export function fetchCreatePosition(data: Api.SystemModule.PositionForm) {
  return request<Api.SystemModule.Position>({
    data,
    method: 'post',
    url: SYSTEM_MODULE_URLS.POSITION_CREATE
  });
}

/** 更新岗位 */
export function fetchUpdatePosition(id: number, data: Api.SystemModule.PositionForm) {
  return request<Api.SystemModule.Position>({
    data,
    method: 'put',
    url: SYSTEM_MODULE_URLS.POSITION_UPDATE(id)
  });
}

/** 删除岗位（支持批量） */
export function fetchDeletePosition(ids: number[]) {
  return request<null>({
    data: ids,
    method: 'delete',
    url: SYSTEM_MODULE_URLS.POSITION_DELETE
  });
}

/** 批量修改岗位状态 */
export function fetchBatchSetPositionStatus(data: Api.SystemModule.BatchSetAvailable) {
  return request<null>({
    data,
    method: 'patch',
    url: SYSTEM_MODULE_URLS.POSITION_BATCH_STATUS
  });
}

/** 岗位下拉选项（仅启用） */
export async function fetchGetPositionOptions() {
  return fetchAllBackendPages<Api.SystemModule.IdNameItem & { status?: string }>(async ({ current, size }) => {
    return request<BackendPageResult<Api.SystemModule.IdNameItem & { status?: string }>>({
      method: 'get',
      params: { page_no: current, page_size: size, status: '0' },
      url: SYSTEM_MODULE_URLS.POSITION_LIST
    });
  });
}
