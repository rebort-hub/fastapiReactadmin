import type { BackendPageResult } from './adapters/page';
import { adaptBackendPage, toBackendPageParams } from './adapters/page';
import { request } from '../request';
import { SYSTEM_MODULE_URLS } from '../urls/system-module';

type DictTypeSearchParams = Api.SystemModule.DictTypeSearchParams;
type DictDataSearchParams = Api.SystemModule.DictDataSearchParams;

/** 字典类型分页列表 */
export async function fetchGetDictTypeList(params?: DictTypeSearchParams) {
  const page = await request<BackendPageResult<Api.SystemModule.DictType>>({
    method: 'get',
    params: toBackendPageParams(params),
    url: SYSTEM_MODULE_URLS.DICT_TYPE_LIST
  });

  return adaptBackendPage(page, params ?? {});
}

/** 全部字典类型 */
export function fetchGetDictTypeOptions() {
  return request<Api.SystemModule.DictType[]>({
    method: 'get',
    url: SYSTEM_MODULE_URLS.DICT_TYPE_OPTION
  });
}

/** 字典类型详情 */
export function fetchGetDictTypeDetail(id: number) {
  return request<Api.SystemModule.DictType>({
    method: 'get',
    url: SYSTEM_MODULE_URLS.DICT_TYPE_DETAIL(id)
  });
}

/** 创建字典类型 */
export function fetchCreateDictType(data: Api.SystemModule.DictTypeForm) {
  return request<Api.SystemModule.DictType>({
    data,
    method: 'post',
    url: SYSTEM_MODULE_URLS.DICT_TYPE_CREATE
  });
}

/** 更新字典类型 */
export function fetchUpdateDictType(id: number, data: Api.SystemModule.DictTypeForm) {
  return request<Api.SystemModule.DictType>({
    data,
    method: 'put',
    url: SYSTEM_MODULE_URLS.DICT_TYPE_UPDATE(id)
  });
}

/** 删除字典类型 */
export function fetchDeleteDictType(ids: number[]) {
  return request<null>({
    data: ids,
    method: 'delete',
    url: SYSTEM_MODULE_URLS.DICT_TYPE_DELETE
  });
}

/** 批量修改字典类型状态 */
export function fetchBatchSetDictTypeStatus(data: Api.SystemModule.BatchSetAvailable) {
  return request<null>({
    data,
    method: 'patch',
    url: SYSTEM_MODULE_URLS.DICT_TYPE_BATCH_STATUS
  });
}

/** 字典数据分页列表 */
export async function fetchGetDictDataList(params?: DictDataSearchParams) {
  const page = await request<BackendPageResult<Api.SystemModule.DictData>>({
    method: 'get',
    params: toBackendPageParams(params),
    url: SYSTEM_MODULE_URLS.DICT_DATA_LIST
  });

  return adaptBackendPage(page, params ?? {});
}

/** 字典数据详情 */
export function fetchGetDictDataDetail(id: number) {
  return request<Api.SystemModule.DictData>({
    method: 'get',
    url: SYSTEM_MODULE_URLS.DICT_DATA_DETAIL(id)
  });
}

/** 创建字典数据 */
export function fetchCreateDictData(data: Api.SystemModule.DictDataForm) {
  return request<Api.SystemModule.DictData>({
    data,
    method: 'post',
    url: SYSTEM_MODULE_URLS.DICT_DATA_CREATE
  });
}

/** 更新字典数据 */
export function fetchUpdateDictData(id: number, data: Api.SystemModule.DictDataForm) {
  return request<Api.SystemModule.DictData>({
    data,
    method: 'put',
    url: SYSTEM_MODULE_URLS.DICT_DATA_UPDATE(id)
  });
}

/** 删除字典数据 */
export function fetchDeleteDictData(ids: number[]) {
  return request<null>({
    data: ids,
    method: 'delete',
    url: SYSTEM_MODULE_URLS.DICT_DATA_DELETE
  });
}

/** 批量修改字典数据状态 */
export function fetchBatchSetDictDataStatus(data: Api.SystemModule.BatchSetAvailable) {
  return request<null>({
    data,
    method: 'patch',
    url: SYSTEM_MODULE_URLS.DICT_DATA_BATCH_STATUS
  });
}
