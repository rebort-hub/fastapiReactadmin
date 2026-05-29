import { useState } from 'react';

import Auth from '@/components/Auth';
import { getHttpMethodTagColor, getLogTypeLabel, getStatusCodeTagColor } from '@/constants/log';
import { Perm } from '@/constants/permissions';
import { DEFAULT_PAGE_SIZE } from '@/constants/pagination';
import { TableHeaderOperation, useTable, useTableOperate, useTableScroll } from '@/features/table';
import { fetchDeleteLog, fetchGetLogDetail, fetchGetLogList } from '@/service/api';

import LogDetailModal from './modules/log-detail-modal';
import LogSearch from './modules/log-search';

function transformLogSearchParams(
  params: Api.SystemModule.LogSearchParams & {
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

  return next as Api.SystemModule.LogSearchParams;
}

const LogManage = () => {
  const { t } = useTranslation();
  const isMobile = useMobile();
  const { scrollConfig, tableWrapperRef } = useTableScroll();

  const [detailOpen, setDetailOpen] = useState(false);
  const [detailData, setDetailData] = useState<Api.SystemModule.Log | null>(null);

  const { columnChecks, data, run, searchProps, setColumnChecks, tableProps } = useTable({
    apiFn: fetchGetLogList,
    apiParams: {
      created_time: null,
      current: 1,
      request_path: null,
      size: DEFAULT_PAGE_SIZE,
      type: null
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
        dataIndex: 'type',
        key: 'type',
        render: (_, record) => {
          const key = getLogTypeLabel(record.type);
          if (!key) {
            return null;
          }
          return <ATag color={record.type === 1 ? 'success' : 'processing'}>{t(key)}</ATag>;
        },
        title: t('page.manage.log.logType'),
        width: 100
      },
      {
        dataIndex: 'request_path',
        ellipsis: true,
        key: 'request_path',
        minWidth: 200,
        title: t('page.manage.log.requestPath')
      },
      {
        align: 'center',
        dataIndex: 'request_method',
        key: 'request_method',
        render: (_, record) => {
          if (!record.request_method) {
            return null;
          }
          return <ATag color={getHttpMethodTagColor(record.request_method)}>{record.request_method}</ATag>;
        },
        title: t('page.manage.log.requestMethod'),
        width: 90
      },
      {
        align: 'center',
        dataIndex: 'response_code',
        key: 'response_code',
        render: (_, record) => {
          if (!record.response_code) {
            return null;
          }
          return <ATag color={getStatusCodeTagColor(record.response_code)}>{record.response_code}</ATag>;
        },
        title: t('page.manage.log.responseCode'),
        width: 90
      },
      {
        align: 'center',
        dataIndex: 'request_ip',
        key: 'request_ip',
        title: t('page.manage.log.requestIp'),
        width: 130
      },
      {
        align: 'center',
        dataIndex: 'process_time',
        key: 'process_time',
        title: t('page.manage.log.processTime'),
        width: 100
      },
      {
        align: 'center',
        dataIndex: 'created_time',
        key: 'created_time',
        minWidth: 160,
        title: t('page.manage.log.createdTime')
      },
      {
        align: 'center',
        key: 'operate',
        render: (_, record) => (
          <div className="flex-center gap-8px">
            <Auth perm={Perm.Log.detail}>
              <AButton
                size="small"
                onClick={() => openDetail(record.id)}
              >
                {t('page.manage.log.view')}
              </AButton>
            </Auth>
            <Auth perm={Perm.Log.delete}>
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
        width: 150
      }
    ],
    rowKey: 'id',
    transformParams: transformLogSearchParams
  });

  const { OperateFormBinder, checkedRowKeys, onBatchDeleted, onDeleted, rowSelection } = useTableOperate(
    data,
    run,
    async () => undefined
  );

  async function openDetail(id: number) {
    const detail = await fetchGetLogDetail(id);
    setDetailData(detail);
    setDetailOpen(true);
  }

  async function handleBatchDelete() {
    await fetchDeleteLog(checkedRowKeys as number[]);
    onBatchDeleted();
  }

  async function handleDelete(id: number) {
    await fetchDeleteLog([id]);
    onDeleted();
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
            children: <LogSearch {...searchProps} />,
            key: '1',
            label: t('common.search')
          }
        ]}
      />

      <ACard
        className="flex-col-stretch sm:flex-1-hidden card-wrapper"
        ref={tableWrapperRef}
        title={t('page.manage.log.title')}
        variant="borderless"
        extra={
          <TableHeaderOperation
            add={() => undefined}
            columns={columnChecks}
            deletePermission={Perm.Log.delete}
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
      </ACard>

      <LogDetailModal
        data={detailData}
        open={detailOpen}
        onClose={() => {
          setDetailOpen(false);
          setDetailData(null);
        }}
      />
    </div>
  );
};

export default LogManage;
