/** 将 FastAPI 菜单树转为菜单管理页（SystemManage）表格数据 */
function mapMenuType(type: Api.SystemModule.MenuType): Api.SystemManage.MenuType {
  if (type === 1) {
    return '1';
  }
  return '2';
}

/** 后端 status：0 启用 / 1 禁用 → 模板表格 status：1 启用 / 2 禁用 */
function mapStatus(status?: string | null): Api.Common.EnableStatus {
  return status === '1' ? '2' : '1';
}

function adaptMenuNode(node: Api.SystemModule.BackendMenu): Api.SystemManage.Menu {
  const children = node.children?.map(adaptMenuNode);

  return {
    children: children?.length ? children : undefined,
    component: node.component_path ?? undefined,
    createBy: '',
    createTime: '',
    hideInMenu: node.hidden ?? false,
    icon: node.icon ?? '',
    iconType: '1',
    id: node.id ?? 0,
    keepAlive: node.keep_alive ?? true,
    menuName: node.name,
    menuType: mapMenuType(node.type),
    order: node.order ?? 0,
    parentId: node.parent_id ?? 0,
    routeName: node.route_name ?? '',
    routePath: node.route_path ?? '',
    status: mapStatus(node.status),
    updateBy: '',
    updateTime: ''
  };
}

function countNodes(nodes: Api.SystemModule.BackendMenu[]): number {
  return nodes.reduce((sum, node) => sum + 1 + countNodes(node.children ?? []), 0);
}

export function adaptMenuTreeToManageList(
  tree: Api.SystemModule.BackendMenu[]
): Api.SystemManage.MenuList {
  const records = tree.map(adaptMenuNode);
  const total = countNodes(tree);

  return {
    current: 1,
    records,
    size: total || records.length || 1,
    total
  };
}
