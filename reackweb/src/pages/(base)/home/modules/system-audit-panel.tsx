import NumberTicker from '@/components/NumberTicker';

import { useHomeData } from '../use-home-data';

type AuditCardProps = {
  action?: () => void;
  actionText?: string;
  gradient?: boolean;
  icon: string;
  iconColor: string;
  title: string;
  value: number;
};

function AuditCard({ action, actionText, gradient, icon, iconColor, title, value }: AuditCardProps) {
  const content = (
    <>
      <div className="mb-8px flex items-center justify-between">
        <div
          className="size-32px flex-center rd-8px"
          style={gradient ? { backgroundColor: 'rgba(255,255,255,0.2)' } : { backgroundColor: `${iconColor}18`, color: iconColor }}
        >
          <SvgIcon
            className="text-16px"
            icon={icon}
          />
        </div>
        {action && actionText ? (
          <AButton
            className={gradient ? 'text-white! hover:text-white/80!' : ''}
            size="small"
            type="link"
            onClick={action}
          >
            {actionText}
          </AButton>
        ) : null}
      </div>
      <div className={`text-12px ${gradient ? 'text-white/85' : 'text-gray-500'}`}>{title}</div>
      <NumberTicker
        className={`text-24px font-700 ${gradient ? 'text-white' : 'text-gray-800'}`}
        value={value}
      />
    </>
  );

  if (gradient) {
    return (
      <div
        className="h-full rd-10px px-14px py-12px text-white shadow-sm"
        style={{ background: 'linear-gradient(135deg, #4096ff 0%, #1677ff 100%)' }}
      >
        {content}
      </div>
    );
  }

  return <div className="h-full rd-10px bg-#fafafa px-14px py-12px">{content}</div>;
}

const SystemAuditPanel = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data, loading } = useHomeData();
  const overview = data?.overview;

  const auditCards: AuditCardProps[] = [
    {
      action: () => navigate('/manage/notice'),
      actionText: t('page.home.viewMore'),
      icon: 'ant-design:bell-outlined',
      iconColor: '#ff4d4f',
      title: t('page.home.activeNotices'),
      value: overview?.availableNoticeCount ?? 0
    },
    {
      action: () => navigate('/manage/notice'),
      actionText: t('page.home.viewMore'),
      icon: 'ant-design:notification-outlined',
      iconColor: '#1677ff',
      title: t('page.home.noticeCount'),
      value: overview?.noticeCount ?? 0
    },
    {
      gradient: true,
      icon: 'ri:group-line',
      iconColor: '#1677ff',
      title: t('page.home.onlineCount'),
      value: overview?.onlineCount ?? 0
    },
    {
      action: () => navigate('/manage/log'),
      actionText: t('page.home.viewDetail'),
      icon: 'ant-design:control-outlined',
      iconColor: '#13c2c2',
      title: t('page.home.todayOperation'),
      value: overview?.todayOperationCount ?? 0
    }
  ];

  const statCards = [
    { color: '#1677ff', title: t('page.home.userCount'), value: overview?.userCount ?? 0 },
    { color: '#722ed1', title: t('page.home.logCount'), value: overview?.logCount ?? 0 },
    { color: '#52c41a', title: t('page.home.todayLogin'), value: overview?.todayLoginCount ?? 0 },
    { color: '#fa8c16', title: t('page.home.roleCount'), value: overview?.roleCount ?? 0 }
  ];

  return (
    <ASpace
      className="w-full"
      direction="vertical"
      size={16}
    >
      <ACard
        className="card-wrapper"
        loading={loading}
        size="small"
        title={t('page.home.systemAudit')}
        variant="borderless"
      >
        <ARow gutter={[12, 12]}>
          {auditCards.map(card => (
            <ACol
              key={card.title}
              span={12}
            >
              <AuditCard {...card} />
            </ACol>
          ))}
        </ARow>
      </ACard>

      <ACard
        className="card-wrapper"
        loading={loading}
        size="small"
        title={t('page.home.dataStats')}
        variant="borderless"
      >
        <ARow gutter={[12, 12]}>
          {statCards.map(card => (
            <ACol
              key={card.title}
              span={12}
            >
              <div className="rd-10px bg-#fafafa px-14px py-12px">
                <div
                  className="mb-8px text-12px"
                  style={{ color: card.color }}
                >
                  {card.title}
                </div>
                <NumberTicker
                  className="text-22px font-700"
                  value={card.value}
                />
              </div>
            </ACol>
          ))}
        </ARow>
      </ACard>
    </ASpace>
  );
};

export default SystemAuditPanel;
