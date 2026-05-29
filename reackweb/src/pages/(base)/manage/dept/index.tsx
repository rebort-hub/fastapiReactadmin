import { Suspense, lazy, useState } from 'react';
import { useRequest } from 'ahooks';
import type { TableProps } from 'antd';

import Auth from '@/components/Auth';
import { BACKEND_USER_STATUS_TAG_MAP, backendUserStatusRecord } from '@/constants/backend-user';
import { Perm } from '@/constants/permissions';
import { FormInstanceBinder } from '@/features/table';
import {
  fetchCreateDept,
  fetchDeleteDept,
  fetchGetDeptDetail,
  fetchGetDeptTree,
  fetchUpdateDept
} from '@/service/api';

import DeptSearch from './modules/dept-search';

const DeptOperateDrawer = lazy(() => import('./modules/dept-operate-drawer'));

type OperateType = 'add' | 'addChild' | 'edit';

const INITIAL_SEARCH: Api.SystemModule.DeptSearchParams = {
  name: null,
  status: null
};

function toDeptFormPayload(values: Api.SystemModule.DeptForm): Api.SystemModule.DeptForm {
  return {
    code: values.code,
    description: values.description || undefined,
    email: values.email || undefined,
    leader: values.leader || undefined,
    name: values.name,
    order: values.order ?? 1,
    parent_id: values.parent_id ?? null,
    phone: values.phone || undefined,
    status: values.status ?? '0'
  };
}

const DeptManage = () => {
  const { t } = useTranslation();
  const isMobile = useMobile();

  const [searchParams, setSearchParams] = useState(INITIAL_SEARCH);
  const [operateType, setOperateType] = useState<OperateType>('add');
  const [editingId, setEditingId] = useState<number>();
  const [drawerOpen, { setFalse: closeDrawer, setTrue: openDrawer }] = useBoolean();
  const [checkedRowKeys, setCheckedRowKeys] = useState<React.Key[]>([]);
  const [expandedRowKeys, setExpandedRowKeys] = useState<React.Key[]>([]);

  const [form] = AForm.useForm<Api.SystemModule.DeptForm>();

  const { data: deptTree = [], loading, refresh } = useRequest(() => fetchGetDeptTree(searchParams), {
    refreshDeps: [searchParams]
  });

  function handleSearch(values: Api.SystemModule.DeptSearchParams) {
    setSearchParams({
      name: values.name ?? null,
      status: values.status ?? null
    });
  }

  function handleResetSearch() {
    setSearchParams(INITIAL_SEARCH);
  }

  function openAdd(parentId?: number) {
    setOperateType(parentId ? 'addChild' : 'add');
    setEditingId(undefined);
    form.resetFields();
    form.setFieldsValue({
      order: 1,
      parent_id: parentId,
      status: '0'
    });
    openDrawer();
  }

  async function openEdit(id: number) {
    const detail = await fetchGetDeptDetail(id);
    setOperateType('edit');
    setEditingId(id);
    form.setFieldsValue({
      code: detail.code,
      description: detail.description ?? undefined,
      email: detail.email ?? undefined,
      leader: detail.leader ?? undefined,
      name: detail.name,
      order: detail.order ?? 1,
      parent_id: detail.parent_id ?? undefined,
      phone: detail.phone ?? undefined,
      status: detail.status ?? '0'
    });
    openDrawer();
  }

  async function handleSubmit() {
    const values = await form.validateFields();
    const payload = toDeptFormPayload(values);

    if (operateType === 'edit' && editingId) {
      await fetchUpdateDept(editingId, payload);
    } else {
      await fetchCreateDept(payload);
    }

    window.$message?.success(t('common.updateSuccess'));
    closeDrawer();
    form.resetFields();
    refresh();
  }

  async function handleDelete(id: number) {
    await fetchDeleteDept([id]);
    window.$message?.success(t('common.deleteSuccess'));
    setCheckedRowKeys(keys => keys.filter(key => key !== id));
    refresh();
  }

  async function handleBatchDelete() {
    await fetchDeleteDept(checkedRowKeys as number[]);
    window.$message?.success(t('common.deleteSuccess'));
    setCheckedRowKeys([]);
    refresh();
  }

  function toggleExpandAll() {
    if (expandedRowKeys.length > 0) {
      setExpandedRowKeys([]);
      return;
    }

    const keys: React.Key[] = [];
    function walk(nodes: Api.SystemModule.Dept[]) {
      nodes.forEach(node => {
        keys.push(node.id);
        if (node.children?.length) {
          walk(node.children);
        }
      });
    }
    walk(deptTree);
    setExpandedRowKeys(keys);
  }

  const columns: TableProps<Api.SystemModule.Dept>['columns'] = [
    {
      dataIndex: 'name',
      key: 'name',
      minWidth: 180,
      title: t('page.manage.dept.deptName')
    },
    {
      align: 'center',
      dataIndex: 'code',
      key: 'code',
      title: t('page.manage.dept.deptCode'),
      width: 120
    },
    {
      align: 'center',
      dataIndex: 'order',
      key: 'order',
      title: t('page.manage.dept.order'),
      width: 80
    },
    {
      align: 'center',
      dataIndex: 'leader',
      key: 'leader',
      render: value => value || '-',
      title: t('page.manage.dept.leader'),
      width: 100
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
      title: t('page.manage.dept.deptStatus'),
      width: 90
    },
    {
      align: 'center',
      key: 'operate',
      render: (_, record) => (
        <div className="flex-center justify-end gap-8px">
          <Auth perm={Perm.Dept.create}>
            <AButton
              ghost
              size="small"
              type="primary"
              onClick={() => openAdd(record.id)}
            >
              {t('page.manage.dept.addChildDept')}
            </AButton>
          </Auth>
          <Auth perm={Perm.Dept.update}>
            <AButton
              size="small"
              onClick={() => openEdit(record.id)}
            >
              {t('common.edit')}
            </AButton>
          </Auth>
          <Auth perm={Perm.Dept.delete}>
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
      width: 240
    }
  ];

  return (
    <div className="h-full min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
      <FormInstanceBinder
        active={drawerOpen}
        form={form}
      />
      <ACollapse
        bordered={false}
        className="card-wrapper"
        defaultActiveKey={isMobile ? undefined : '1'}
        items={[
          {
            children: (
              <DeptSearch
                searchParams={searchParams}
                onReset={handleResetSearch}
                onSearch={handleSearch}
              />
            ),
            key: '1',
            label: t('common.search')
          }
        ]}
      />

      <ACard
        className="flex-col-stretch flex-1 sm:flex-1-hidden card-wrapper"
        title={t('page.manage.dept.title')}
        variant="borderless"
        extra={
          <AFlex gap={8}>
            <AButton onClick={toggleExpandAll}>
              {expandedRowKeys.length > 0 ? t('page.manage.dept.collapseAll') : t('page.manage.dept.expandAll')}
            </AButton>
            <Auth perm={Perm.Dept.create}>
              <AButton
                type="primary"
                onClick={() => openAdd()}
              >
                {t('page.manage.dept.addDept')}
              </AButton>
            </Auth>
            <Auth perm={Perm.Dept.delete}>
              <AButton
                danger
                disabled={checkedRowKeys.length === 0}
                onClick={handleBatchDelete}
              >
                {t('common.batchDelete')}
              </AButton>
            </Auth>
            <AButton
              icon={<IconIcRoundRefresh />}
              loading={loading}
              onClick={refresh}
            >
              {t('common.refresh')}
            </AButton>
          </AFlex>
        }
      >
        <ATable
          columns={columns}
          dataSource={deptTree}
          expandable={{
            expandedRowKeys,
            onExpandedRowsChange: keys => setExpandedRowKeys([...keys])
          }}
          loading={loading}
          pagination={false}
          rowKey="id"
          rowSelection={{
            onChange: keys => setCheckedRowKeys(keys),
            selectedRowKeys: checkedRowKeys
          }}
          size="small"
        />

        <Suspense>
          <DeptOperateDrawer
            deptTree={deptTree}
            editingId={editingId}
            form={form}
            handleSubmit={handleSubmit}
            open={drawerOpen}
            operateType={operateType}
            onClose={closeDrawer}
          />
        </Suspense>
      </ACard>
    </div>
  );
};

export default DeptManage;
