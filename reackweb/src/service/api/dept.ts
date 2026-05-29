import { request } from '../request';
import { SYSTEM_MODULE_URLS } from '../urls/system-module';

type DeptSearchParams = Api.SystemModule.DeptSearchParams;

function toDeptQueryParams(params?: DeptSearchParams) {
  const query: Record<string, unknown> = {};

  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      query[key] = value;
    }
  });

  return query;
}

/** 部门树 */
export function fetchGetDeptTree(params?: DeptSearchParams) {
  return request<Api.SystemModule.Dept[]>({
    method: 'get',
    params: toDeptQueryParams(params),
    url: SYSTEM_MODULE_URLS.DEPT_TREE
  });
}

/** 部门详情 */
export function fetchGetDeptDetail(id: number) {
  return request<Api.SystemModule.Dept>({
    method: 'get',
    url: SYSTEM_MODULE_URLS.DEPT_DETAIL(id)
  });
}

/** 创建部门 */
export function fetchCreateDept(data: Api.SystemModule.DeptForm) {
  return request<Api.SystemModule.Dept>({
    data,
    method: 'post',
    url: SYSTEM_MODULE_URLS.DEPT_CREATE
  });
}

/** 更新部门 */
export function fetchUpdateDept(id: number, data: Api.SystemModule.DeptForm) {
  return request<Api.SystemModule.Dept>({
    data,
    method: 'put',
    url: SYSTEM_MODULE_URLS.DEPT_UPDATE(id)
  });
}

/** 删除部门（支持批量） */
export function fetchDeleteDept(ids: number[]) {
  return request<null>({
    data: ids,
    method: 'delete',
    url: SYSTEM_MODULE_URLS.DEPT_DELETE
  });
}

/** 批量修改部门状态 */
export function fetchBatchSetDeptStatus(data: Api.SystemModule.BatchSetAvailable) {
  return request<null>({
    data,
    method: 'patch',
    url: SYSTEM_MODULE_URLS.DEPT_BATCH_STATUS
  });
}
