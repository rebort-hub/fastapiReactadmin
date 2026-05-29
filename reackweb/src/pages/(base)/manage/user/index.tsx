import { Suspense, lazy } from 'react';

import {
  BACKEND_USER_GENDER_TAG_MAP,
  BACKEND_USER_STATUS_TAG_MAP,
  backendUserGenderRecord,
  backendUserStatusRecord
} from '@/constants/backend-user';
import Auth from '@/components/Auth';
import { Perm } from '@/constants/permissions';
import { DEFAULT_PAGE_SIZE } from '@/constants/pagination';
import { TableHeaderOperation, useTable, useTableOperate, useTableScroll } from '@/features/table';
import {
  fetchCreateUser,
  fetchDeleteUser,
  fetchGetUserDetail,
  fetchGetUserList,
  fetchUpdateUser
} from '@/service/api';

import UserSearch from './modules/UserSearch';

const UserOperateDrawer = lazy(() => import('./modules/UserOperateDrawer'));

function toUserFormPayload(
  values: Api.SystemModule.UserForm & { role_ids?: number[]; position_ids?: number[] }
): Api.SystemModule.UserForm {
  return {
    dept_id: values.dept_id ?? undefined,
    email: values.email || undefined,
    gender: values.gender,
    mobile: values.mobile || undefined,
    name: values.name,
    password: values.password || undefined,
    position_ids: values.position_ids ?? [],
    role_ids: values.role_ids ?? [],
    status: values.status ?? '0',
    username: values.username
  };
}

const UserManage = () => {
  const { t } = useTranslation();

  const { scrollConfig, tableWrapperRef } = useTableScroll();

  const nav = useNavigate();

  const isMobile = useMobile();

  const { columnChecks, data, run, searchProps, setColumnChecks, tableProps } = useTable({
    apiFn: fetchGetUserList,
    apiParams: {
      current: 1,
      email: null,
      gender: null,
      mobile: null,
      name: null,
      size: DEFAULT_PAGE_SIZE,
      status: null,
      username: null
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
        dataIndex: 'username',
        key: 'username',
        minWidth: 110,
        title: t('page.manage.user.userName')
      },
      {
        align: 'center',
        dataIndex: 'name',
        key: 'name',
        minWidth: 100,
        title: t('page.manage.user.nickName')
      },
      {
        align: 'center',
        dataIndex: 'gender',
        key: 'gender',
        render: (_, record) => {
          if (!record.gender) return null;
          const label = t(backendUserGenderRecord[record.gender]);
          return <ATag color={BACKEND_USER_GENDER_TAG_MAP[record.gender]}>{label}</ATag>;
        },
        title: t('page.manage.user.userGender'),
        width: 90
      },
      {
        align: 'center',
        dataIndex: 'mobile',
        key: 'mobile',
        title: t('page.manage.user.userPhone'),
        width: 130
      },
      {
        align: 'center',
        dataIndex: 'email',
        key: 'email',
        minWidth: 180,
        title: t('page.manage.user.userEmail')
      },
      {
        align: 'center',
        dataIndex: 'dept_name',
        key: 'dept_name',
        minWidth: 120,
        render: (_, record) => record.dept_name || record.dept?.name || '-',
        title: '部门'
      },
      {
        align: 'center',
        dataIndex: 'positions',
        ellipsis: true,
        key: 'positions',
        minWidth: 120,
        render: (_, record) => record.positions?.map(item => item.name).join('、') || '-',
        title: t('page.manage.user.userPosition')
      },
      {
        align: 'center',
        dataIndex: 'status',
        key: 'status',
        render: (_, record) => {
          if (!record.status) return null;
          const label = t(backendUserStatusRecord[record.status]);
          return <ATag color={BACKEND_USER_STATUS_TAG_MAP[record.status]}>{label}</ATag>;
        },
        title: t('page.manage.user.userStatus'),
        width: 90
      },
      {
        align: 'center',
        key: 'operate',
        render: (_, record) => (
          <div className="flex-center gap-8px">
            <Auth perm={Perm.User.update}>
              <AButton
                ghost
                size="small"
                type="primary"
                onClick={() => edit(record.id)}
              >
                {t('common.edit')}
              </AButton>
            </Auth>
            <Auth perm={Perm.User.detail}>
              <AButton
                size="small"
                onClick={() => nav(`/manage/user/${record.id}`)}
              >
                详情
              </AButton>
            </Auth>
            <Auth perm={Perm.User.delete}>
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
        width: 195
      }
    ],
    pagination: {
      showQuickJumper: true
    },
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
  } = useTableOperate(
    data as unknown as AntDesign.TableData[],
    run,
    async (values, type) => {
      const payload = toUserFormPayload(
        values as unknown as Api.SystemModule.UserForm & { role_ids?: number[]; position_ids?: number[] }
      );

      if (type === 'add') {
        await fetchCreateUser(payload);
      } else if (editingData?.id) {
        await fetchUpdateUser(editingData.id, payload);
      }
    }
  );

  async function handleBatchDelete() {
    await fetchDeleteUser(checkedRowKeys as number[]);
    onBatchDeleted();
  }

  async function handleDelete(id: number) {
    await fetchDeleteUser([id]);
    onDeleted();
  }

  async function edit(id: number) {
    const detail = await fetchGetUserDetail(id);
    handleEdit({
      ...detail,
      position_ids: detail.positions?.map(item => item.id) ?? [],
      role_ids: detail.roles?.map(item => item.id) ?? []
    } as unknown as AntDesign.TableData);
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
            children: <UserSearch {...searchProps} />,
            key: '1',
            label: t('common.search')
          }
        ]}
      />

      <ACard
        className="flex-col-stretch sm:flex-1-hidden card-wrapper"
        ref={tableWrapperRef}
        title={t('page.manage.user.title')}
        variant="borderless"
        extra={
          <TableHeaderOperation
            add={handleAdd}
            addPermission={Perm.User.create}
            columns={columnChecks}
            deletePermission={Perm.User.delete}
            disabledDelete={checkedRowKeys.length === 0}
            loading={tableProps.loading}
            refresh={run}
            setColumnChecks={setColumnChecks}
            onDelete={handleBatchDelete}
          />
        }
      >
        <ATable
          scroll={scrollConfig}
          size="small"
          {...tableProps}
          // rowSelection 与后端 User 类型兼容，与 TableDataWithIndex 泛型存在差异
          rowSelection={rowSelection as any}
        />
        <Suspense>
          <UserOperateDrawer {...generalPopupOperation} />
        </Suspense>
      </ACard>
    </div>
  );
};

export default UserManage;
