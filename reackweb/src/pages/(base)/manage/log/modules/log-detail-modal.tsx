import { getHttpMethodTagColor, getLogTypeLabel, getStatusCodeTagColor } from '@/constants/log';

type Props = {
  data: Api.SystemModule.Log | null;
  onClose: () => void;
  open: boolean;
};

function formatJsonBlock(value?: string | null) {
  if (!value) {
    return '-';
  }
  try {
    return JSON.stringify(JSON.parse(value), null, 2);
  } catch {
    return value;
  }
}

const LogDetailModal: FC<Props> = memo(({ data, onClose, open }) => {
  const { t } = useTranslation();

  if (!data) {
    return null;
  }

  const typeKey = getLogTypeLabel(data.type);

  const items = [
    {
      children: typeKey ? <ATag color={data.type === 1 ? 'success' : 'processing'}>{t(typeKey)}</ATag> : '-',
      key: 'type',
      label: t('page.manage.log.logType')
    },
    { children: data.request_path || '-', key: 'request_path', label: t('page.manage.log.requestPath') },
    {
      children: data.request_method ? (
        <ATag color={getHttpMethodTagColor(data.request_method)}>{data.request_method}</ATag>
      ) : (
        '-'
      ),
      key: 'request_method',
      label: t('page.manage.log.requestMethod')
    },
    {
      children: data.response_code ? (
        <ATag color={getStatusCodeTagColor(data.response_code)}>{data.response_code}</ATag>
      ) : (
        '-'
      ),
      key: 'response_code',
      label: t('page.manage.log.responseCode')
    },
    { children: data.request_ip || '-', key: 'request_ip', label: t('page.manage.log.requestIp') },
    { children: data.login_location || '-', key: 'login_location', label: t('page.manage.log.loginLocation') },
    { children: data.process_time || '-', key: 'process_time', label: t('page.manage.log.processTime') },
    { children: data.created_time || '-', key: 'created_time', label: t('page.manage.log.createdTime') },
    {
      children: <pre className="m-0 max-h-120px overflow-auto whitespace-pre-wrap text-xs">{formatJsonBlock(data.request_payload)}</pre>,
      key: 'request_payload',
      label: t('page.manage.log.requestPayload'),
      span: 2
    },
    {
      children: <pre className="m-0 max-h-200px overflow-auto whitespace-pre-wrap text-xs">{formatJsonBlock(data.response_json)}</pre>,
      key: 'response_json',
      label: t('page.manage.log.responseJson'),
      span: 2
    }
  ];

  return (
    <AModal
      footer={null}
      open={open}
      title={t('page.manage.log.logDetail')}
      width={900}
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

export default LogDetailModal;
