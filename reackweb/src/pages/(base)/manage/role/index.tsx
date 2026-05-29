import { Suspense } from 'react';

import Auth from '@/components/Auth';
import { BACKEND_USER_STATUS_TAG_MAP, backendUserStatusRecord } from '@/constants/backend-user';
import { Perm } from '@/constants/permissions';
import { TableHeaderOperation, useTable, useTableOperate, useTableScroll } from '@/features/table';
import {
  fetchCreateRole,
  fetchDeleteRole,
  fetchGetRoleDetail,
  fetchGetRoleList,
  fetchUpdateRole
} from '@/service/api';

import RoleSearch from './modules/role-search';

const RoleOperateDrawer = lazy(() => import('./modules/role-operate-drawer'));
const PermissionDrawer = lazy(() => import('./modules/permission-drawer'));

function toRoleFormPayload(values: Api.SystemModule.RoleForm): Api.SystemModule.RoleForm {
  return {
    code: values.code,
    data_scope: values.data_scope ?? 1,
    description: values.description || undefined,
    name: values.name,
    order: values.order ?? 1,
    status: values.status ?? '0'
  };
}

const Role = () => {
  const { t } = useTranslation();

  const isMobile = useMobile();

  const nav = useNavigate();

  const [permissionState, setPermissionState] = useState<{ roleId: number; roleName: string } | null>(null);

  const { scrollConfig, tableWrapperRef } = useTableScroll();

  const { columnChecks, data, run, searchProps, setColumnChecks, tableProps } = useTable({
    apiFn: fetchGetRoleList,
    apiParams: {
      current: 1,
      name: null,
      size: 10,
      status: null
    },
    columns: () => [
      {
        align: 'center',
        dataIndex: 'index',
        key: 'index',
        title: t('common.index'),
        width: 64
      },
      {
        align: 'center',
        dataIndex: 'name',
        key: 'name',
        minWidth: 120,
        title: t('page.manage.role.roleName')
      },
      {
        align: 'center',
        dataIndex: 'code',
        key: 'code',
        minWidth: 120,
        title: t('page.manage.role.roleCode')
      },
      {
        dataIndex: 'description',
        ellipsis: true,
        key: 'description',
        minWidth: 120,
        title: t('page.manage.role.roleDesc')
      },
      {
        align: 'center',
        dataIndex: 'status',
        key: 'status',
        render: (_, record) => {
          if (!record.status) {
            return null;
          }
          const label = t(backendUserStatusRecord[record.status]);
          return <ATag color={BACKEND_USER_STATUS_TAG_MAP[record.status]}>{label}</ATag>;
        },
        title: t('page.manage.role.roleStatus'),
        width: 100
      },
      {
        align: 'center',
        key: 'operate',
        render: (_, record) => (
          <div className="flex-center gap-8px">
            <Auth perm={Perm.Role.update}>
              <AButton
                ghost
                size="small"
                type="primary"
                onClick={() => edit(record.id)}
              >
                {t('common.edit')}
              </AButton>
            </Auth>
            <Auth perm={Perm.Role.permission}>
              <AButton
                size="small"
                onClick={() => setPermissionState({ roleId: record.id, roleName: record.name })}
              >
                {t('page.manage.role.permissionAssign')}
              </AButton>
            </Auth>
            <Auth perm={Perm.Role.detail}>
              <AButton
                size="small"
                onClick={() => nav(`/manage/role/${record.id}`)}
              >
                详情
              </AButton>
            </Auth>
            <Auth perm={Perm.Role.delete}>
              <APopconfirm
                title={t('common.confirmDelete')}
                onConfirm={() => handleDelete(record.id)}
              >
                <AButton
                  danger
                  size="small"
                >
                  {t('common.delete')}
                </AButton>
              </APopconfirm>
            </Auth>
          </div>
        ),
        title: t('common.operate'),
        width: 260
      }
    ],
    rowKey: 'id'
  });

  const {
    OperateFormBinder,
    checkedRowKeys,
    editingData,
    generalPopupOperation,
    handleAdd,
    handleEdit,
    onBatchDeleted,
    onDeleted,
    rowSelection
  } = useTableOperate(data, run, async (values, type) => {
    const payload = toRoleFormPayload(values as unknown as Api.SystemModule.RoleForm);

    if (type === 'add') {
      await fetchCreateRole(payload);
    } else if (editingData?.id) {
      await fetchUpdateRole(editingData.id, payload);
    }
  });

  async function handleBatchDelete() {
    await fetchDeleteRole(checkedRowKeys as number[]);
    onBatchDeleted();
  }

  async function handleDelete(id: number) {
    await fetchDeleteRole([id]);
    onDeleted();
  }

  async function edit(id: number) {
    const detail = await fetchGetRoleDetail(id);
    handleEdit(detail as unknown as AntDesign.TableData);
  }

  return (
    <div className="h-full min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
      <OperateFormBinder />
      <ACollapse
        bordered={false}
        className="card-wrapper"
        defaultActiveKey={isMobile ? undefined : '1'}
        items={[
          {
            children: <RoleSearch {...searchProps} />,
            key: '1',
            label: t('common.search')
          }
        ]}
      />

      <ACard
        className="flex-col-stretch sm:flex-1-hidden card-wrapper"
        ref={tableWrapperRef}
        title={t('page.manage.role.title')}
        variant="borderless"
        extra={
          <TableHeaderOperation
            add={handleAdd}
            addPermission={Perm.Role.create}
            columns={columnChecks}
            deletePermission={Perm.Role.delete}
            disabledDelete={checkedRowKeys.length === 0}
            loading={tableProps.loading}
            refresh={run}
            setColumnChecks={setColumnChecks}
            onDelete={handleBatchDelete}
          />
        }
      >
        <ATable
          rowSelection={rowSelection}
          scroll={scrollConfig}
          size="small"
          {...tableProps}
        />

        <Suspense>
          <RoleOperateDrawer
            {...generalPopupOperation}
            rowId={editingData?.id || -1}
          />
          {permissionState && (
            <PermissionDrawer
              open
              roleId={permissionState.roleId}
              roleName={permissionState.roleName}
              onClose={() => setPermissionState(null)}
            />
          )}
        </Suspense>
      </ACard>
    </div>
  );
};

export default Role;
