import type { BackendPageResult } from './adapters/page';
import { adaptBackendPage, fetchAllBackendPages, toBackendPageParams } from './adapters/page';
import { request } from '../request';
import { SYSTEM_MODULE_URLS } from '../urls/system-module';

type RoleSearchParams = Api.SystemModule.RoleSearchParams;

/** 角色分页列表 */
export async function fetchGetRoleList(params?: RoleSearchParams) {
  const page = await request<BackendPageResult<Api.SystemModule.Role>>({
    method: 'get',
    params: toBackendPageParams(params),
    url: SYSTEM_MODULE_URLS.ROLE_LIST
  });

  return adaptBackendPage(page, params ?? {});
}

/** 角色详情 */
export function fetchGetRoleDetail(id: number) {
  return request<Api.SystemModule.Role>({
    method: 'get',
    url: SYSTEM_MODULE_URLS.ROLE_DETAIL(id)
  });
}

/** 创建角色 */
export function fetchCreateRole(data: Api.SystemModule.RoleForm) {
  return request<Api.SystemModule.Role>({
    data,
    method: 'post',
    url: SYSTEM_MODULE_URLS.ROLE_CREATE
  });
}

/** 更新角色 */
export function fetchUpdateRole(id: number, data: Api.SystemModule.RoleForm) {
  return request<Api.SystemModule.Role>({
    data,
    method: 'put',
    url: SYSTEM_MODULE_URLS.ROLE_UPDATE(id)
  });
}

/** 删除角色（支持批量） */
export function fetchDeleteRole(ids: number[]) {
  return request<null>({
    data: ids,
    method: 'delete',
    url: SYSTEM_MODULE_URLS.ROLE_DELETE
  });
}

/** 批量修改角色状态 */
export function fetchBatchSetRoleStatus(data: Api.SystemModule.BatchSetAvailable) {
  return request<null>({
    data,
    method: 'patch',
    url: SYSTEM_MODULE_URLS.ROLE_BATCH_STATUS
  });
}

/** 角色权限配置（菜单 / 数据范围 / 部门） */
export function fetchSetRolePermission(data: Api.SystemModule.RolePermissionSetting) {
  return request<null>({
    data,
    method: 'patch',
    url: SYSTEM_MODULE_URLS.ROLE_PERMISSION
  });
}

/** 全部启用角色（下拉等场景） */
export async function fetchGetAllRoles() {
  return fetchGetRoleOptions();
}

/** 角色下拉选项 */
export async function fetchGetRoleOptions() {
  return fetchAllBackendPages<Api.SystemModule.IdNameItem & { status?: string }>(async ({ current, size }) => {
    return request<BackendPageResult<Api.SystemModule.IdNameItem & { status?: string }>>({
      method: 'get',
      params: { page_no: current, page_size: size, status: '0' },
      url: SYSTEM_MODULE_URLS.ROLE_LIST
    });
  });
}

/** 扁平化菜单树 ID */
export function flattenMenuIds(menus: Api.SystemModule.Menu[] = []): number[] {
  const ids: number[] = [];

  function walk(items: Api.SystemModule.Menu[]) {
    items.forEach(item => {
      ids.push(item.id);
      if (item.children?.length) {
        walk(item.children);
      }
    });
  }

  walk(menus);
  return ids;
}

/** 按菜单类型收集 ID */
export function collectMenuIdsByTypes(
  menus: Api.SystemModule.Menu[],
  types: Api.SystemModule.MenuType[]
): number[] {
  const ids: number[] = [];

  function walk(items: Api.SystemModule.Menu[]) {
    items.forEach(item => {
      if (types.includes(item.type)) {
        ids.push(item.id);
      }
      if (item.children?.length) {
        walk(item.children);
      }
    });
  }

  walk(menus);
  return ids;
}

/** 按菜单类型过滤树 */
export function filterMenuTreeByTypes(
  menus: Api.SystemModule.Menu[],
  types: Api.SystemModule.MenuType[]
): Api.SystemModule.Menu[] {
  return menus
    .map(menu => {
      const children = menu.children?.length ? filterMenuTreeByTypes(menu.children, types) : [];
      const matched = types.includes(menu.type);

      if (!matched && !children.length) {
        return null;
      }

      return {
        ...menu,
        children
      };
    })
    .filter((menu): menu is Api.SystemModule.Menu => menu !== null);
}
