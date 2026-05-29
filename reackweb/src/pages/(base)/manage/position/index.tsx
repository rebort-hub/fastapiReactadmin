import { Suspense, lazy } from 'react';

import Auth from '@/components/Auth';
import { BACKEND_USER_STATUS_TAG_MAP, backendUserStatusRecord } from '@/constants/backend-user';
import { Perm } from '@/constants/permissions';
import { DEFAULT_PAGE_SIZE } from '@/constants/pagination';
import { TableHeaderOperation, useTable, useTableOperate, useTableScroll } from '@/features/table';
import {
  fetchCreatePosition,
  fetchDeletePosition,
  fetchGetPositionDetail,
  fetchGetPositionList,
  fetchUpdatePosition
} from '@/service/api';

import PositionSearch from './modules/position-search';

const PositionOperateDrawer = lazy(() => import('./modules/position-operate-drawer'));

function toPositionFormPayload(values: Api.SystemModule.PositionForm): Api.SystemModule.PositionForm {
  return {
    description: values.description || undefined,
    name: values.name,
    order: values.order ?? 1,
    status: values.status ?? '0'
  };
}

const PositionManage = () => {
  const { t } = useTranslation();

  const isMobile = useMobile();

  const { scrollConfig, tableWrapperRef } = useTableScroll();

  const { columnChecks, data, run, searchProps, setColumnChecks, tableProps } = useTable({
    apiFn: fetchGetPositionList,
    apiParams: {
      current: 1,
      name: null,
      size: DEFAULT_PAGE_SIZE,
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
        title: t('page.manage.position.positionName')
      },
      {
        align: 'center',
        dataIndex: 'order',
        key: 'order',
        title: t('page.manage.position.order'),
        width: 80
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
        title: t('page.manage.position.positionStatus'),
        width: 100
      },
      {
        dataIndex: 'description',
        ellipsis: true,
        key: 'description',
        minWidth: 160,
        title: t('page.manage.position.positionDesc')
      },
      {
        align: 'center',
        dataIndex: 'created_time',
        key: 'created_time',
        minWidth: 160,
        title: t('page.manage.position.createdTime')
      },
      {
        align: 'center',
        key: 'operate',
        render: (_, record) => (
          <div className="flex-center gap-8px">
            <Auth perm={Perm.Position.update}>
              <AButton
                ghost
                size="small"
                type="primary"
                onClick={() => edit(record.id)}
              >
                {t('common.edit')}
              </AButton>
            </Auth>
            <Auth perm={Perm.Position.delete}>
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
        width: 140
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
    const payload = toPositionFormPayload(values as unknown as Api.SystemModule.PositionForm);

    if (type === 'add') {
      await fetchCreatePosition(payload);
    } else if (editingData?.id) {
      await fetchUpdatePosition(editingData.id, payload);
    }
  });

  async function handleBatchDelete() {
    await fetchDeletePosition(checkedRowKeys as number[]);
    onBatchDeleted();
  }

  async function handleDelete(id: number) {
    await fetchDeletePosition([id]);
    onDeleted();
  }

  async function edit(id: number) {
    const detail = await fetchGetPositionDetail(id);
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
            children: <PositionSearch {...searchProps} />,
            key: '1',
            label: t('common.search')
          }
        ]}
      />

      <ACard
        className="flex-col-stretch sm:flex-1-hidden card-wrapper"
        ref={tableWrapperRef}
        title={t('page.manage.position.title')}
        variant="borderless"
        extra={
          <TableHeaderOperation
            add={handleAdd}
            addPermission={Perm.Position.create}
            columns={columnChecks}
            deletePermission={Perm.Position.delete}
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
          <PositionOperateDrawer {...generalPopupOperation} />
        </Suspense>
      </ACard>
    </div>
  );
};

export default PositionManage;
