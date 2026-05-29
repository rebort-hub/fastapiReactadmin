import { SimpleScrollbar } from '@sa/materials';
import type { DataNode } from 'antd/es/tree';
import { useMemo, useState } from 'react';

import {
  collectMenuIdsByTypes,
  fetchGetMenuTree,
  fetchGetRoleDetail,
  fetchSetRolePermission,
  filterMenuTreeByTypes
} from '@/service/api';
import { QUERY_KEYS } from '@/service/keys';
import { queryClient } from '@/service/queryClient';

const MENU_TYPES: Api.SystemModule.MenuType[] = [1, 2, 4];

function convertMenuTreeToDataNode(menus: Api.SystemModule.Menu[]): DataNode[] {
  return menus.map(menu => ({
    children: menu.children?.length ? convertMenuTreeToDataNode(menu.children) : undefined,
    key: menu.id,
    title: menu.name
  }));
}

type Props = {
  roleId: number;
  showFooter?: boolean;
  onSaved?: () => void;
};

const MenuAuthPanel: FC<Props> = memo(({ onSaved, roleId, showFooter = true }) => {
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [menuTree, setMenuTree] = useState<Api.SystemModule.Menu[]>([]);
  const [checks, setChecks] = useState<number[]>([]);
  const [roleSnapshot, setRoleSnapshot] = useState<Api.SystemModule.Role | null>(null);

  const treeData = useMemo(() => {
    return convertMenuTreeToDataNode(filterMenuTreeByTypes(menuTree, MENU_TYPES));
  }, [menuTree]);

  async function init() {
    if (roleId <= 0) return;

    setLoading(true);
    try {
      const [tree, detail] = await Promise.all([fetchGetMenuTree({ status: '0' }), fetchGetRoleDetail(roleId)]);

      setMenuTree(tree ?? []);
      setRoleSnapshot(detail);
      setChecks(collectMenuIdsByTypes(detail.menus ?? [], MENU_TYPES));
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit() {
    if (!roleSnapshot) return;

    setSubmitting(true);
    try {
      const buttonMenuIds = collectMenuIdsByTypes(roleSnapshot.menus ?? [], [3]);

      await fetchSetRolePermission({
        data_scope: roleSnapshot.data_scope ?? 1,
        dept_ids: roleSnapshot.depts?.map(item => item.id) ?? [],
        menu_ids: [...new Set([...(checks ?? []), ...buttonMenuIds])],
        role_ids: [roleId]
      });

      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUTH.USER_INFO });
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ROUTE.USER_ROUTES });

      window.$message?.success(t('common.modifySuccess'));
      onSaved?.();
    } finally {
      setSubmitting(false);
    }
  }

  useEffect(() => {
    init();
  }, [roleId]);

  return (
    <div className="h-full min-h-360px flex flex-col gap-12px">
      <SimpleScrollbar className="min-h-0 flex-1">
        {loading ? (
          <div className="h-full min-h-280px flex-center">
            <ASpin />
          </div>
        ) : (
          <ATree
            blockNode
            checkable
            checkedKeys={checks}
            treeData={treeData}
            onCheck={value => setChecks(value as number[])}
          />
        )}
      </SimpleScrollbar>

      {showFooter && (
        <AFlex
          className="shrink-0"
          justify="flex-end"
        >
          <AButton
            loading={submitting}
            size="small"
            type="primary"
            onClick={handleSubmit}
          >
            {t('common.confirm')}
          </AButton>
        </AFlex>
      )}
    </div>
  );
});

export default MenuAuthPanel;
