type StatusTagProps = {
  status?: string | null;
};

/** 后端状态：0 启用，1 禁用 */
export function StatusTag({ status }: StatusTagProps) {
  const enabled = status === '0';
  return <ATag color={enabled ? 'success' : 'default'}>{enabled ? '启用' : '禁用'}</ATag>;
}
