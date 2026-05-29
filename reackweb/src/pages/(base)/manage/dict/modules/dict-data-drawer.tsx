import { Suspense, lazy } from 'react';

import Auth from '@/components/Auth';
import { BACKEND_USER_STATUS_TAG_MAP, backendUserStatusRecord } from '@/constants/backend-user';
import { Perm } from '@/constants/permissions';
import { DEFAULT_PAGE_SIZE } from '@/constants/pagination';
import { TableHeaderOperation, useTable, useTableOperate, useTableScroll } from '@/features/table';
import {
  fetchCreateDictData,
  fetchDeleteDictData,
  fetchGetDictDataDetail,
  fetchGetDictDataList,
  fetchUpdateDictData
} from '@/service/api';

type Props = {
  dictType: Api.SystemModule.DictType | null;
  onClose: () => void;
  open: boolean;
};

const DictDataOperateModal = lazy(() => import('./dict-data-operate-modal'));

function toDictDataPayload(
  values: Api.SystemModule.DictDataForm,
  dictType: Api.SystemModule.DictType
): Api.SystemModule.DictDataForm {
  return {
    css_class: values.css_class || undefined,
    description: values.description || undefined,
    dict_label: values.dict_label,
    dict_sort: values.dict_sort ?? 1,
    dict_type: dictType.dict_type,
    dict_type_id: dictType.id,
    dict_value: values.dict_value,
    is_default: values.is_default ?? false,
    list_class: values.list_class || undefined,
    status: values.status ?? '0'
  };
}

type DictDataTableProps = {
  dictType: Api.SystemModule.DictType;
};

/** 按字典类型加载数据；用 key 挂载保证 dict_type_id 正确 */
function DictDataTable({ dictType }: DictDataTableProps) {
  const { t } = useTranslation();

  const { columnChecks, data, run, setColumnChecks, tableProps } = useTable({
    apiFn: fetchGetDictDataList,
    apiParams: {
      current: 1,
      dict_type_id: dictType.id,
      size: DEFAULT_PAGE_SIZE,
      status: null
    },
    isChangeURL: false,
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
        dataIndex: 'dict_label',
        key: 'dict_label',
        minWidth: 120,
        title: t('page.manage.dict.dictLabel')
      },
      {
        align: 'center',
        dataIndex: 'dict_value',
        key: 'dict_value',
        minWidth: 120,
        title: t('page.manage.dict.dictValue')
      },
      {
        align: 'center',
        dataIndex: 'dict_sort',
        key: 'dict_sort',
        title: t('page.manage.dict.dictSort'),
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
        title: t('page.manage.dict.dictStatus'),
        width: 90
      },
      {
        align: 'center',
        key: 'operate',
        render: (_, record) => (
          <div className="flex-center gap-8px">
            <Auth perm={Perm.DictData.update}>
              <AButton
                ghost
                size="small"
                type="primary"
                onClick={() => edit(record.id)}
              >
                {t('common.edit')}
              </AButton>
            </Auth>
            <Auth perm={Perm.DictData.delete}>
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
    pagination: {
      showQuickJumper: false
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
  } = useTableOperate(data, run, async (values, type) => {
    const payload = toDictDataPayload(values as unknown as Api.SystemModule.DictDataForm, dictType);

    if (type === 'add') {
      await fetchCreateDictData(payload);
    } else if (editingData?.id) {
      await fetchUpdateDictData(editingData.id, payload);
    }
  });

  async function handleBatchDelete() {
    await fetchDeleteDictData(checkedRowKeys as number[]);
    onBatchDeleted();
  }

  async function handleDelete(id: number) {
    await fetchDeleteDictData([id]);
    onDeleted();
  }

  async function edit(id: number) {
    const detail = await fetchGetDictDataDetail(id);
    handleEdit(detail as unknown as AntDesign.TableData);
  }

  return (
    <div className="dict-data-drawer-table flex-col-stretch gap-12px">
      <OperateFormBinder />
      <TableHeaderOperation
        add={handleAdd}
        addPermission={Perm.DictData.create}
        columns={columnChecks}
        deletePermission={Perm.DictData.delete}
        disabledDelete={checkedRowKeys.length === 0}
        loading={tableProps.loading}
        refresh={run}
        setColumnChecks={setColumnChecks}
        onDelete={handleBatchDelete}
      />
      <ATable
        className="dict-data-drawer-table__inner"
        rowSelection={rowSelection}
        scroll={{ x: 800, y: 420 }}
        size="small"
        {...tableProps}
      />

      <Suspense>
        <DictDataOperateModal {...generalPopupOperation} />
      </Suspense>
    </div>
  );
}

const DictDataDrawer: FC<Props> = ({ dictType, onClose, open }) => {
  const { t } = useTranslation();

  return (
    <ADrawer
      destroyOnClose
      open={open}
      styles={{
        body: {
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          paddingBottom: 16
        }
      }}
      title={
        dictType
          ? `${t('page.manage.dict.dictDataTitle')} - ${dictType.dict_name} (${dictType.dict_type})`
          : t('page.manage.dict.dictDataTitle')
      }
      width={920}
      onClose={onClose}
    >
      {open && dictType ? <DictDataTable dictType={dictType} key={dictType.id} /> : null}
    </ADrawer>
  );
};

export default DictDataDrawer;
