import type { TreeSelectProps } from 'antd';

/** 将部门树转为 TreeSelect 数据 */
export function mapDeptToTreeSelectData(
  depts: Api.SystemModule.Dept[],
  options?: { excludeIds?: Set<number> }
): TreeSelectProps['treeData'] {
  const exclude = options?.excludeIds ?? new Set<number>();

  return depts
    .filter(dept => !exclude.has(dept.id))
    .map(dept => ({
      children: dept.children?.length ? mapDeptToTreeSelectData(dept.children, options) : undefined,
      title: dept.name,
      value: dept.id
    }));
}

/** 收集某部门及其所有子部门 ID（编辑时禁止选为上级） */
export function collectDeptDescendantIds(depts: Api.SystemModule.Dept[], rootId: number) {
  const result = new Set<number>();

  function addSubtree(node: Api.SystemModule.Dept) {
    result.add(node.id);
    node.children?.forEach(addSubtree);
  }

  function find(nodes: Api.SystemModule.Dept[]): boolean {
    for (const node of nodes) {
      if (node.id === rootId) {
        addSubtree(node);
        return true;
      }
      if (node.children?.length && find(node.children)) {
        return true;
      }
    }
    return false;
  }

  find(depts);
  return result;
}

/** 扁平化部门树 */
export function flattenDeptTree(depts: Api.SystemModule.Dept[] = []) {
  const list: Api.SystemModule.Dept[] = [];

  function walk(nodes: Api.SystemModule.Dept[]) {
    nodes.forEach(node => {
      list.push(node);
      if (node.children?.length) {
        walk(node.children);
      }
    });
  }

  walk(depts);
  return list;
}
