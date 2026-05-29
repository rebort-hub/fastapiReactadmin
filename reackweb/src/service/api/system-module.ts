import { request } from '../request';
import { SYSTEM_MODULE_URLS } from '../urls/system-module';

/** 菜单树 */
export function fetchGetMenuTree(params?: Record<string, unknown>) {
  return request<Api.SystemModule.BackendMenu[]>({
    method: 'get',
    params,
    url: SYSTEM_MODULE_URLS.MENU_TREE
  });
}
