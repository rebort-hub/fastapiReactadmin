/** 公告类型：1 通知 2 公告 */
export const NOTICE_TYPE_OPTIONS: { label: App.I18n.I18nKey; value: string }[] = [
  { label: 'page.manage.notice.typeNotice', value: '1' },
  { label: 'page.manage.notice.typeAnnouncement', value: '2' }
];

export const NOTICE_TYPE_TAG_MAP: Record<string, string> = {
  '1': 'processing',
  '2': 'warning'
};

export function getNoticeTypeLabel(type?: string | null) {
  if (type === '1') {
    return 'page.manage.notice.typeNotice' as const;
  }
  if (type === '2') {
    return 'page.manage.notice.typeAnnouncement' as const;
  }
  return null;
}
