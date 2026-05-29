import { Suspense, lazy, useState } from 'react';

import Auth from '@/components/Auth';
import { BACKEND_USER_STATUS_TAG_MAP, backendUserStatusRecord } from '@/constants/backend-user';
import { getNoticeTypeLabel, NOTICE_TYPE_TAG_MAP } from '@/constants/notice';
import { Perm } from '@/constants/permissions';
import { DEFAULT_PAGE_SIZE } from '@/constants/pagination';
import { TableHeaderOperation, useTable, useTableOperate, useTableScroll } from '@/features/table';
import {
  fetchCreateNotice,
  fetchDeleteNotice,
  fetchGetNoticeDetail,
  fetchGetNoticeList,
  fetchUpdateNotice
} from '@/service/api';

import NoticeSearch from './modules/notice-search';

const NoticeOperateDrawer = lazy(() => import('./modules/notice-operate-drawer'));
const NoticeDetailModal = lazy(() => import('./modules/notice-detail-modal'));

function transformNoticeSearchParams(
  params: Api.SystemModule.NoticeSearchParams & {
    created_time?: (import('dayjs').Dayjs | string)[] | null;
  }
) {
  const { created_time, ...rest } = params ?? {};
  const next: Record<string, unknown> = { ...rest };

  if (created_time?.length === 2) {
    next.created_time = created_time.map(item =>
      typeof item === 'string' ? item : item.format('YYYY-MM-DD HH:mm:ss')
    );
  }

  return next as Api.SystemModule.NoticeSearchParams;
}

function toNoticeFormPayload(values: Api.SystemModule.NoticeForm): Api.SystemModule.NoticeForm {
  return {
    description: values.description || undefined,
    notice_content: values.notice_content,
    notice_title: values.notice_title,
    notice_type: values.notice_type,
    status: values.status ?? '0'
  };
}

const NoticeManage = () => {
  const { t } = useTranslation();
  const isMobile = useMobile();
  const { scrollConfig, tableWrapperRef } = useTableScroll();

  const [detailOpen, setDetailOpen] = useState(false);
  const [detailData, setDetailData] = useState<Api.SystemModule.Notice | null>(null);

  const { columnChecks, data, run, searchProps, setColumnChecks, tableProps } = useTable({
    apiFn: fetchGetNoticeList,
    apiParams: {
      created_time: null,
      current: 1,
      notice_title: null,
      notice_type: null,
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
        dataIndex: 'notice_title',
        ellipsis: true,
        key: 'notice_title',
        minWidth: 200,
        title: t('page.manage.notice.noticeTitle')
      },
      {
        align: 'center',
        dataIndex: 'notice_type',
        key: 'notice_type',
        render: (_, record) => {
          const key = getNoticeTypeLabel(record.notice_type);
          if (!key) {
            return null;
          }
          return <ATag color={NOTICE_TYPE_TAG_MAP[record.notice_type!]}>{t(key)}</ATag>;
        },
        title: t('page.manage.notice.noticeType'),
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
          return (
            <ATag color={BACKEND_USER_STATUS_TAG_MAP[record.status]}>
              {t(backendUserStatusRecord[record.status])}
            </ATag>
          );
        },
        title: t('page.manage.notice.noticeStatus'),
        width: 90
      },
      {
        align: 'center',
        dataIndex: 'created_time',
        key: 'created_time',
        minWidth: 160,
        title: t('page.manage.notice.createdTime')
      },
      {
        align: 'center',
        key: 'operate',
        render: (_, record) => (
          <div className="flex-center gap-8px">
            <Auth perm={Perm.Notice.detail}>
              <AButton
                size="small"
                onClick={() => openDetail(record.id)}
              >
                {t('page.manage.notice.view')}
              </AButton>
            </Auth>
            <Auth perm={Perm.Notice.update}>
              <AButton
                ghost
                size="small"
                type="primary"
                onClick={() => edit(record.id)}
              >
                {t('common.edit')}
              </AButton>
            </Auth>
            <Auth perm={Perm.Notice.delete}>
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
        width: 200
      }
    ],
    rowKey: 'id',
    transformParams: transformNoticeSearchParams
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
    const payload = toNoticeFormPayload(values as unknown as Api.SystemModule.NoticeForm);

    if (type === 'add') {
      await fetchCreateNotice(payload);
    } else if (editingData?.id) {
      await fetchUpdateNotice(editingData.id, payload);
    }
  });

  async function openDetail(id: number) {
    const detail = await fetchGetNoticeDetail(id);
    setDetailData(detail);
    setDetailOpen(true);
  }

  async function handleBatchDelete() {
    await fetchDeleteNotice(checkedRowKeys as number[]);
    onBatchDeleted();
  }

  async function handleDelete(id: number) {
    await fetchDeleteNotice([id]);
    onDeleted();
  }

  async function edit(id: number) {
    const detail = await fetchGetNoticeDetail(id);
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
            children: <NoticeSearch {...searchProps} />,
            key: '1',
            label: t('common.search')
          }
        ]}
      />

      <ACard
        className="flex-col-stretch sm:flex-1-hidden card-wrapper"
        ref={tableWrapperRef}
        title={t('page.manage.notice.title')}
        variant="borderless"
        extra={
          <TableHeaderOperation
            add={handleAdd}
            addPermission={Perm.Notice.create}
            columns={columnChecks}
            deletePermission={Perm.Notice.delete}
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
          <NoticeOperateDrawer {...generalPopupOperation} />
        </Suspense>
      </ACard>

      <Suspense>
        <NoticeDetailModal
          data={detailData}
          open={detailOpen}
          onClose={() => {
            setDetailOpen(false);
            setDetailData(null);
          }}
        />
      </Suspense>
    </div>
  );
};

export default NoticeManage;
