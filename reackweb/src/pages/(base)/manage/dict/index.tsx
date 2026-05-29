import { Suspense, lazy, useState } from 'react';

import Auth from '@/components/Auth';
import { BACKEND_USER_STATUS_TAG_MAP, backendUserStatusRecord } from '@/constants/backend-user';
import { Perm } from '@/constants/permissions';
import { DEFAULT_PAGE_SIZE } from '@/constants/pagination';
import { TableHeaderOperation, useTable, useTableOperate, useTableScroll } from '@/features/table';
import {
  fetchCreateDictType,
  fetchDeleteDictType,
  fetchGetDictTypeDetail,
  fetchGetDictTypeList,
  fetchUpdateDictType
} from '@/service/api';

import DictDataDrawer from './modules/dict-data-drawer';
import DictTypeSearch from './modules/dict-type-search';

const DictTypeOperateDrawer = lazy(() => import('./modules/dict-type-operate-drawer'));

function toDictTypePayload(values: Api.SystemModule.DictTypeForm): Api.SystemModule.DictTypeForm {
  return {
    description: values.description || undefined,
    dict_name: values.dict_name,
    dict_type: values.dict_type,
    status: values.status ?? '0'
  };
}

const DictManage = () => {
  const { t } = useTranslation();
  const isMobile = useMobile();
  const { scrollConfig, tableWrapperRef } = useTableScroll();

  const [dataDrawerOpen, setDataDrawerOpen] = useState(false);
  const [currentDictType, setCurrentDictType] = useState<Api.SystemModule.DictType | null>(null);

  const { columnChecks, data, run, searchProps, setColumnChecks, tableProps } = useTable({
    apiFn: fetchGetDictTypeList,
    apiParams: {
      current: 1,
      dict_name: null,
      dict_type: null,
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
        dataIndex: 'dict_name',
        key: 'dict_name',
        minWidth: 140,
        title: t('page.manage.dict.dictName')
      },
      {
        align: 'center',
        dataIndex: 'dict_type',
        key: 'dict_type',
        minWidth: 140,
        render: value => <ATag color="processing">{value}</ATag>,
        title: t('page.manage.dict.dictType')
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
        title: t('page.manage.dict.dictStatus'),
        width: 90
      },
      {
        dataIndex: 'description',
        ellipsis: true,
        key: 'description',
        minWidth: 160,
        title: t('page.manage.dict.dictDesc')
      },
      {
        align: 'center',
        key: 'operate',
        render: (_, record) => (
          <div className="flex-center gap-8px">
            <Auth perm={Perm.DictData.query}>
              <AButton
                size="small"
                onClick={() => openDictData(record)}
              >
                {t('page.manage.dict.dictData')}
              </AButton>
            </Auth>
            <Auth perm={Perm.DictType.update}>
              <AButton
                ghost
                size="small"
                type="primary"
                onClick={() => edit(record.id)}
              >
                {t('common.edit')}
              </AButton>
            </Auth>
            <Auth perm={Perm.DictType.delete}>
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
        width: 220
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
    const payload = toDictTypePayload(values as unknown as Api.SystemModule.DictTypeForm);

    if (type === 'add') {
      await fetchCreateDictType(payload);
    } else if (editingData?.id) {
      await fetchUpdateDictType(editingData.id, payload);
    }
  });

  function openDictData(record: Api.SystemModule.DictType) {
    setCurrentDictType(record);
    setDataDrawerOpen(true);
  }

  async function handleBatchDelete() {
    await fetchDeleteDictType(checkedRowKeys as number[]);
    onBatchDeleted();
  }

  async function handleDelete(id: number) {
    await fetchDeleteDictType([id]);
    onDeleted();
  }

  async function edit(id: number) {
    const detail = await fetchGetDictTypeDetail(id);
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
            children: <DictTypeSearch {...searchProps} />,
            key: '1',
            label: t('common.search')
          }
        ]}
      />

      <ACard
        className="flex-col-stretch sm:flex-1-hidden card-wrapper"
        ref={tableWrapperRef}
        title={t('page.manage.dict.title')}
        variant="borderless"
        extra={
          <TableHeaderOperation
            add={handleAdd}
            addPermission={Perm.DictType.create}
            columns={columnChecks}
            deletePermission={Perm.DictType.delete}
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
          <DictTypeOperateDrawer {...generalPopupOperation} />
        </Suspense>
      </ACard>

      <DictDataDrawer
        dictType={currentDictType}
        open={dataDrawerOpen}
        onClose={() => {
          setDataDrawerOpen(false);
          setCurrentDictType(null);
        }}
      />
    </div>
  );
};

export default DictManage;
