import Auth from '@/components/Auth';
import { DEFAULT_PAGE_SIZE } from '@/constants/pagination';
import { Perm } from '@/constants/permissions';
import { getCurrentSessionIdFromToken } from '@/features/auth/shared';
import { TableHeaderOperation, useTable, useTableScroll } from '@/features/table';
import { fetchClearOnlineUsers, fetchGetOnlineUserList, fetchKickOnlineUser } from '@/service/api';

import OnlineSearch from './modules/online-search';

const OnlineUserManage = () => {
  const { t } = useTranslation();
  const isMobile = useMobile();
  const { scrollConfig, tableWrapperRef } = useTableScroll();

  const { columnChecks, run, searchProps, setColumnChecks, tableProps } = useTable({
    apiFn: fetchGetOnlineUserList,
    apiParams: {
      current: 1,
      ipaddr: null,
      login_location: null,
      name: null,
      size: DEFAULT_PAGE_SIZE
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
        dataIndex: 'session_id',
        ellipsis: true,
        key: 'session_id',
        minWidth: 200,
        title: t('page.manage.online.sessionId')
      },
      {
        align: 'center',
        dataIndex: 'login_type',
        key: 'login_type',
        title: t('page.manage.online.loginType'),
        width: 100
      },
      {
        align: 'center',
        dataIndex: 'ipaddr',
        key: 'ipaddr',
        title: t('page.manage.online.ipaddr'),
        width: 140
      },
      {
        align: 'center',
        dataIndex: 'name',
        key: 'name',
        minWidth: 100,
        title: t('page.manage.online.nickName')
      },
      {
        align: 'center',
        dataIndex: 'user_name',
        key: 'user_name',
        minWidth: 100,
        title: t('page.manage.online.userName')
      },
      {
        align: 'center',
        dataIndex: 'login_location',
        ellipsis: true,
        key: 'login_location',
        minWidth: 140,
        title: t('page.manage.online.loginLocation')
      },
      {
        align: 'center',
        dataIndex: 'os',
        key: 'os',
        title: t('page.manage.online.os'),
        width: 120
      },
      {
        align: 'center',
        dataIndex: 'login_time',
        key: 'login_time',
        minWidth: 160,
        title: t('page.manage.online.loginTime')
      },
      {
        align: 'center',
        key: 'operate',
        render: (_, record) => (
          <Auth perm={Perm.Online.delete}>
            <APopconfirm
              title={t('page.manage.online.kickConfirm')}
              onConfirm={() => handleKick(record.session_id)}
            >
              <AButton
                danger
                size="small"
              >
                {t('page.manage.online.kick')}
              </AButton>
            </APopconfirm>
          </Auth>
        ),
        title: t('common.operate'),
        width: 100
      }
    ],
    rowKey: 'session_id'
  });

  async function handleKick(sessionId: string) {
    await fetchKickOnlineUser(sessionId);
    window.$message?.success(t('page.manage.online.kickSuccess'));

    const currentSessionId = getCurrentSessionIdFromToken();
    if (currentSessionId && currentSessionId === sessionId) {
      const { resetAuth } = await import('@/features/auth/auth');
      resetAuth();
      return;
    }

    run(false);
  }

  async function handleClearAll() {
    await fetchClearOnlineUsers();
    window.$message?.success(t('page.manage.online.clearSuccess'));

    const { resetAuth } = await import('@/features/auth/auth');
    resetAuth();
  }

  return (
    <div className="h-full min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
      <ACollapse
        bordered={false}
        className="card-wrapper"
        defaultActiveKey={isMobile ? undefined : '1'}
        items={[
          {
            children: <OnlineSearch {...searchProps} />,
            key: '1',
            label: t('common.search')
          }
        ]}
      />

      <ACard
        className="flex-col-stretch sm:flex-1-hidden card-wrapper"
        ref={tableWrapperRef}
        title={t('page.manage.online.title')}
        variant="borderless"
        extra={
          <TableHeaderOperation
            add={() => undefined}
            columns={columnChecks}
            loading={tableProps.loading}
            refresh={run}
            setColumnChecks={setColumnChecks}
            children={
              <Auth perm={Perm.Online.delete}>
                <APopconfirm
                  title={t('page.manage.online.clearAllConfirm')}
                  onConfirm={handleClearAll}
                >
                  <AButton
                    danger
                    size="small"
                  >
                    {t('page.manage.online.clearAll')}
                  </AButton>
                </APopconfirm>
              </Auth>
            }
            onDelete={() => undefined}
          />
        }
      >
        <ATable
          scroll={scrollConfig}
          size="small"
          {...tableProps}
        />
      </ACard>
    </div>
  );
};

export default OnlineUserManage;
