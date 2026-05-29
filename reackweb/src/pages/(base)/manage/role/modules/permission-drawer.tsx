import type { DataNode } from 'antd/es/tree';
import { useMemo, useState } from 'react';

import { collectMenuIdsByTypes, fetchGetDeptTree, fetchGetRoleDetail, fetchSetRolePermission } from '@/service/api';
import { QUERY_KEYS } from '@/service/keys';
import { queryClient } from '@/service/queryClient';

import ButtonAuthPanel from './button-auth-panel';
import MenuAuthPanel from './menu-auth-panel';

const DATA_SCOPE_OPTIONS = [
  { label: '仅本人数据权限', value: 1 },
  { label: '本部门数据权限', value: 2 },
  { label: '本部门及以下数据权限', value: 3 },
  { label: '全部数据权限', value: 4 },
  { label: '自定义数据权限', value: 5 }
] as const;

type Props = {
  onClose: () => void;
  open: boolean;
  roleId: number;
  roleName: string;
};

function convertDeptTreeToDataNode(depts: Api.SystemModule.Dept[]): DataNode[] {
  return depts.map(dept => ({
    children: dept.children?.length ? convertDeptTreeToDataNode(dept.children) : undefined,
    key: dept.id,
    title: dept.name
  }));
}

const PermissionDrawer: FC<Props> = memo(({ onClose, open, roleId, roleName }) => {
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deptTree, setDeptTree] = useState<Api.SystemModule.Dept[]>([]);
  const [deptChecks, setDeptChecks] = useState<number[]>([]);
  const [dataScope, setDataScope] = useState(1);
  const [roleSnapshot, setRoleSnapshot] = useState<Api.SystemModule.Role | null>(null);
  const [authRefreshKey, setAuthRefreshKey] = useState(0);

  const deptTreeData = useMemo(() => convertDeptTreeToDataNode(deptTree), [deptTree]);

  async function init() {
    if (roleId <= 0) return;

    setLoading(true);
    try {
      const [depts, detail] = await Promise.all([fetchGetDeptTree({ status: '0' }), fetchGetRoleDetail(roleId)]);

      setDeptTree(depts ?? []);
      setRoleSnapshot(detail);
      setDataScope(detail.data_scope ?? 1);
      setDeptChecks(detail.depts?.map(item => item.id) ?? []);
    } finally {
      setLoading(false);
    }
  }

  function handleAuthSaved() {
    setAuthRefreshKey(key => key + 1);
    void fetchGetRoleDetail(roleId).then(setRoleSnapshot);
  }

  async function handleSubmitDataScope() {
    if (!roleSnapshot) return;

    if (roleId === 1) {
      window.$message?.warning('系统默认角色，不可操作');
      return;
    }

    setSubmitting(true);
    try {
      const menuIds = collectMenuIdsByTypes(roleSnapshot.menus ?? [], [1, 2, 3, 4]);

      await fetchSetRolePermission({
        data_scope: dataScope,
        dept_ids: dataScope === 5 ? deptChecks : [],
        menu_ids: menuIds,
        role_ids: [roleId]
      });

      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUTH.USER_INFO });
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ROUTE.USER_ROUTES });

      window.$message?.success(t('common.modifySuccess'));
      onClose();
    } finally {
      setSubmitting(false);
    }
  }

  useUpdateEffect(() => {
    if (open) {
      init();
    }
  }, [open, roleId]);

  return (
    <ADrawer
      destroyOnClose
      open={open}
      title={`【${roleName}】${t('page.manage.role.permissionAssign')}`}
      width={960}
      footer={
        <AButton onClick={onClose}>{t('common.close')}</AButton>
      }
      onClose={onClose}
    >
      {loading ? (
        <div className="h-500px flex-center">
          <ASpin />
        </div>
      ) : (
        <ARow gutter={16}>
          <ACol span={8}>
            <div className="mb-12px font-medium">{t('page.manage.role.dataAuth')}</div>
            <ASelect
              className="w-full"
              options={[...DATA_SCOPE_OPTIONS]}
              value={dataScope}
              onChange={setDataScope}
            />
            {dataScope === 5 && deptTreeData.length > 0 && (
              <div className="mt-16px max-h-460px overflow-auto border border-solid border-[var(--ant-color-border)] p-12px">
                <ATree
                  blockNode
                  checkable
                  checkedKeys={deptChecks}
                  defaultExpandAll
                  treeData={deptTreeData}
                  onCheck={value => setDeptChecks(value as number[])}
                />
              </div>
            )}
            <AFlex
              className="mt-16px"
              justify="flex-end"
            >
              <AButton
                loading={submitting}
                size="small"
                type="primary"
                onClick={handleSubmitDataScope}
              >
                {t('common.confirm')}
              </AButton>
            </AFlex>
          </ACol>
          <ACol
            className="flex flex-col"
            span={8}
          >
            <div className="mb-12px shrink-0 font-medium">{t('page.manage.role.menuAuth')}</div>
            <div className="h-384px flex flex-col border border-solid border-[var(--ant-color-border)] p-12px">
              <MenuAuthPanel
                key={`menu-${roleId}-${authRefreshKey}`}
                roleId={roleId}
                onSaved={handleAuthSaved}
              />
            </div>
          </ACol>
          <ACol
            className="flex flex-col"
            span={8}
          >
            <div className="mb-12px shrink-0 font-medium">{t('page.manage.role.buttonAuth')}</div>
            <div className="h-384px flex flex-col border border-solid border-[var(--ant-color-border)] p-12px">
              <ButtonAuthPanel
                key={`button-${roleId}-${authRefreshKey}`}
                roleId={roleId}
                onSaved={handleAuthSaved}
              />
            </div>
          </ACol>
        </ARow>
      )}
    </ADrawer>
  );
});

export default PermissionDrawer;
