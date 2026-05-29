/** 日志类型：1 登录 2 操作 */
export const LOG_TYPE_OPTIONS: { label: App.I18n.I18nKey; value: number }[] = [
  { label: 'page.manage.log.typeLogin', value: 1 },
  { label: 'page.manage.log.typeOperation', value: 2 }
];

export function getLogTypeLabel(type?: number) {
  if (type === 1) {
    return 'page.manage.log.typeLogin' as const;
  }
  if (type === 2) {
    return 'page.manage.log.typeOperation' as const;
  }
  return null;
}

export function getHttpMethodTagColor(method?: string | null) {
  const map: Record<string, string> = {
    DELETE: 'error',
    GET: 'success',
    PATCH: 'warning',
    POST: 'processing',
    PUT: 'warning'
  };
  return map[method?.toUpperCase() ?? ''] ?? 'default';
}

export function getStatusCodeTagColor(code?: number | null) {
  if (!code) {
    return 'default';
  }
  if (code >= 200 && code < 300) {
    return 'success';
  }
  if (code >= 400) {
    return 'error';
  }
  return 'warning';
}
