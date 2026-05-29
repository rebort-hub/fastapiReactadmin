import { useQuery } from '@tanstack/react-query';
import type { TabsProps } from 'antd';
import dayjs from 'dayjs';

import ButtonIcon from '@/components/ButtonIcon';
import { selectToken } from '@/features/auth/authStore';
import { useRouter } from '@/features/router';
import { fetchGetNoticeAvailable } from '@/service/api';
import { useUserInfo } from '@/service/hooks';
import { QUERY_KEYS } from '@/service/keys';
import { getReadNoticeIds, isNoticeRead, markAllNoticesRead, markNoticeRead } from '@/utils/notice-read';

type NoticeTabKey = 'notice' | 'message' | 'todo';

function stripHtmlContent(html?: string | null) {
  if (!html?.trim()) {
    return '';
  }
  const div = document.createElement('div');
  div.innerHTML = html;
  return (div.textContent || div.innerText || '').trim();
}

function filterByTab(notices: Api.SystemModule.Notice[], tab: NoticeTabKey) {
  if (tab === 'notice') {
    return notices;
  }
  if (tab === 'message') {
    return notices.filter(item => item.notice_type === '1');
  }
  return [];
}

const NoticePopover = memo(() => {
  const token = useAppSelector(selectToken);
  const { data: userInfo } = useUserInfo();
  const userId = userInfo?.userId;
  const { t } = useTranslation();
  const { navigate } = useRouter();

  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<NoticeTabKey>('notice');
  const [readIds, setReadIds] = useState(() => getReadNoticeIds(userId));
  const [detailNotice, setDetailNotice] = useState<Api.SystemModule.Notice | null>(null);

  const { data: noticePage, isLoading, refetch } = useQuery({
    enabled: Boolean(token),
    queryFn: fetchGetNoticeAvailable,
    queryKey: QUERY_KEYS.NOTICE.AVAILABLE
  });

  const allNotices = noticePage?.records ?? [];

  useEffect(() => {
    setReadIds(getReadNoticeIds(userId));
  }, [userId]);

  const tabNotices = useMemo(() => filterByTab(allNotices, activeTab), [activeTab, allNotices]);

  const unreadCount = useMemo(
    () => allNotices.filter(item => !isNoticeRead(userId, item.id, readIds)).length,
    [allNotices, readIds, userId]
  );

  const tabUnreadCount = useMemo(
    () => tabNotices.filter(item => !isNoticeRead(userId, item.id, readIds)).length,
    [readIds, tabNotices, userId]
  );

  function handleMarkAllRead() {
    const ids = tabNotices.map(item => item.id);
    setReadIds(markAllNoticesRead(userId, ids));
  }

  function handleNoticeClick(notice: Api.SystemModule.Notice) {
    setReadIds(markNoticeRead(userId, notice.id));
    setDetailNotice(notice);
  }

  function handleViewAll() {
    setOpen(false);
    navigate('/manage/notice');
  }

  const noticeTabCount = allNotices.length;
  const messageTabCount = filterByTab(allNotices, 'message').length;

  const tabItems: TabsProps['items'] = [
    {
      key: 'notice',
      label: `${t('notification.tabNotice')} (${noticeTabCount})`
    },
    {
      key: 'message',
      label: `${t('notification.tabMessage')} (${messageTabCount})`
    },
    {
      key: 'todo',
      label: `${t('notification.tabTodo')} (0)`
    }
  ];

  const panel = (
    <div className="w-360px">
      <div className="flex items-center justify-between border-b border-[var(--ant-color-border-secondary)] px-16px py-12px">
        <span className="text-16px font-600">{t('notification.title')}</span>
        <AButton
          disabled={!tabNotices.length || tabUnreadCount === 0}
          size="small"
          type="link"
          onClick={handleMarkAllRead}
        >
          {t('notification.markAllRead')}
        </AButton>
      </div>

      <ATabs
        activeKey={activeTab}
        className="notice-header-tabs px-8px"
        items={tabItems}
        size="small"
        onChange={key => setActiveTab(key as NoticeTabKey)}
      />

      <div className="max-h-320px overflow-y-auto px-8px pb-8px">
        {isLoading ? (
          <div className="flex-center py-48px">
            <ASpin />
          </div>
        ) : tabNotices.length ? (
          <ul className="m-0 list-none p-0">
            {tabNotices.map(notice => {
              const unread = !isNoticeRead(userId, notice.id, readIds);
              const preview = stripHtmlContent(notice.notice_content);

              return (
                <li key={notice.id}>
                  <button
                    className="w-full cursor-pointer border-0 bg-transparent px-8px py-10px text-left transition-colors hover:bg-[var(--ant-color-fill-quaternary)]"
                    type="button"
                    onClick={() => handleNoticeClick(notice)}
                  >
                    <div className="flex items-start gap-8px">
                      {unread ? (
                        <span className="mt-6px size-6px flex-shrink-0 rd-full bg-[#ff4d4f]" />
                      ) : (
                        <span className="mt-6px size-6px flex-shrink-0" />
                      )}
                      <div className="min-w-0 flex-1">
                        <div
                          className={
                            unread ? 'text-14px text-[var(--ant-color-text)] font-600' : 'text-14px text-gray-500'
                          }
                        >
                          {notice.notice_title}
                        </div>
                        {preview ? (
                          <div className="mt-4px line-clamp-2 text-12px text-gray-400">{preview}</div>
                        ) : null}
                        {notice.created_time ? (
                          <div className="mt-4px text-12px text-gray-400">
                            {dayjs(notice.created_time).format('YYYY-MM-DD HH:mm')}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        ) : (
          <AEmpty
            className="py-48px"
            description={t('notification.empty')}
            image={AEmpty.PRESENTED_IMAGE_SIMPLE}
          />
        )}
      </div>

      <div className="border-t border-[var(--ant-color-border-secondary)] px-16px py-10px">
        <AButton
          block
          type="text"
          onClick={handleViewAll}
        >
          {t('notification.viewAll')}
        </AButton>
      </div>
    </div>
  );

  if (!token) {
    return null;
  }

  return (
    <>
      <APopover
        arrow={false}
        content={panel}
        open={open}
        placement="bottomRight"
        trigger="click"
        onOpenChange={next => {
          setOpen(next);
          if (next) {
            refetch();
          }
        }}
      >
        <div className="relative px-12px">
          <ButtonIcon
            className="text-icon"
            icon="ant-design:bell-outlined"
            tooltipContent={t('notification.title')}
          />
          {unreadCount > 0 ? (
            <span className="pointer-events-none absolute right-8px top-6px size-8px rd-full bg-[#ff4d4f] border-2 border-white" />
          ) : null}
        </div>
      </APopover>

      <AModal
        footer={null}
        open={Boolean(detailNotice)}
        title={detailNotice?.notice_title}
        width={640}
        onCancel={() => setDetailNotice(null)}
      >
        {detailNotice?.created_time ? (
          <p className="mb-12px text-12px text-gray-400">
            {dayjs(detailNotice.created_time).format('YYYY-MM-DD HH:mm:ss')}
          </p>
        ) : null}
        <div
          className="max-h-60vh overflow-auto text-14px leading-relaxed"
          dangerouslySetInnerHTML={{ __html: detailNotice?.notice_content || '' }}
        />
      </AModal>
    </>
  );
});

export default NoticePopover;
