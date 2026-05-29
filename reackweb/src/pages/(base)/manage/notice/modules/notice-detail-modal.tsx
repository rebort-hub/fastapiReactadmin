import { BACKEND_USER_STATUS_TAG_MAP, backendUserStatusRecord } from '@/constants/backend-user';
import { getNoticeTypeLabel, NOTICE_TYPE_TAG_MAP } from '@/constants/notice';

type Props = {
  data: Api.SystemModule.Notice | null;
  onClose: () => void;
  open: boolean;
};

const NoticeDetailModal: FC<Props> = memo(({ data, onClose, open }) => {
  const { t } = useTranslation();

  if (!data) {
    return null;
  }

  const typeKey = getNoticeTypeLabel(data.notice_type);

  const items = [
    { children: data.notice_title || '-', key: 'notice_title', label: t('page.manage.notice.noticeTitle') },
    {
      children: typeKey ? (
        <ATag color={NOTICE_TYPE_TAG_MAP[data.notice_type!]}>{t(typeKey)}</ATag>
      ) : (
        '-'
      ),
      key: 'notice_type',
      label: t('page.manage.notice.noticeType')
    },
    {
      children: data.status ? (
        <ATag color={BACKEND_USER_STATUS_TAG_MAP[data.status]}>{t(backendUserStatusRecord[data.status])}</ATag>
      ) : (
        '-'
      ),
      key: 'status',
      label: t('page.manage.notice.noticeStatus')
    },
    { children: data.description || '-', key: 'description', label: t('page.manage.notice.description') },
    {
      children: data.notice_content ? (
        <div
          className="max-h-300px overflow-auto"
          dangerouslySetInnerHTML={{ __html: data.notice_content }}
        />
      ) : (
        '-'
      ),
      key: 'notice_content',
      label: t('page.manage.notice.noticeContent'),
      span: 2
    },
    { children: data.created_time || '-', key: 'created_time', label: t('page.manage.notice.createdTime') },
    { children: data.updated_time || '-', key: 'updated_time', label: t('page.manage.notice.updatedTime') }
  ];

  return (
    <AModal
      footer={null}
      open={open}
      title={t('page.manage.notice.noticeDetail')}
      width={800}
      onCancel={onClose}
    >
      <ADescriptions
        bordered
        column={2}
        items={items}
      />
    </AModal>
  );
});

export default NoticeDetailModal;
