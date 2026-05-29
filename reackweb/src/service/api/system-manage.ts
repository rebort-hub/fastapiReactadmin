import { adaptMenuTreeToManageList } from './adapters/menu-manage';
import { fetchGetMenuTree } from './system-module';

/** 菜单管理列表（对接 FastAPI GET /api/v1/system/menu/tree） */
export async function fetchGetMenuList() {
  const tree = await fetchGetMenuTree();
  return adaptMenuTreeToManageList(tree);
}
/** get all pages @deprecated 模板接口 */
export function fetchGetAllPages() {
  return request<string[]>({
    method: 'get',
    url: SYSTEM_MANAGE_URLS.GET_ALL_PAGES
  });
}
