import NumberTicker from '@/components/NumberTicker';

import { useHomeData } from '../use-home-data';

type MetricCardProps = {
  color: string;
  icon: string;
  title: string;
  value: number;
  gradient?: boolean;
};

function MetricCard({ color, gradient, icon, title, value }: MetricCardProps) {
  if (gradient) {
    return (
      <div
        className="h-full rd-10px px-16px py-14px text-white shadow-sm"
        style={{ background: 'linear-gradient(135deg, #4096ff 0%, #1677ff 100%)' }}
      >
        <div className="mb-12px flex items-start justify-between">
          <div className="size-36px flex-center rd-8px bg-white/20">
            <SvgIcon
              className="text-18px"
              icon={icon}
            />
          </div>
        </div>
        <div className="text-13px opacity-90">{title}</div>
        <NumberTicker
          className="text-28px font-700"
          value={value}
        />
      </div>
    );
  }

  return (
    <div className="h-full rd-10px bg-white px-16px py-14px shadow-sm">
      <div className="mb-12px flex items-start justify-between">
        <div
          className="size-36px flex-center rd-8px"
          style={{ backgroundColor: `${color}18`, color }}
        >
          <SvgIcon
            className="text-18px"
            icon={icon}
          />
        </div>
      </div>
      <div className="text-13px text-gray-500">{title}</div>
      <NumberTicker
        className="text-28px text-gray-800 font-700"
        value={value}
      />
    </div>
  );
}

const MetricCards = () => {
  const { t } = useTranslation();
  const { data, loading } = useHomeData();
  const overview = data?.overview;

  const cards: (MetricCardProps & { key: string })[] = [
    {
      color: '#1677ff',
      icon: 'ant-design:user-outlined',
      key: 'userCount',
      title: t('page.home.userCount'),
      value: overview?.userCount ?? 0
    },
    {
      gradient: true,
      color: '#1677ff',
      icon: 'ri:group-line',
      key: 'onlineCount',
      title: t('page.home.onlineCount'),
      value: overview?.onlineCount ?? 0
    },
    {
      color: '#722ed1',
      icon: 'ant-design:file-text-outlined',
      key: 'logCount',
      title: t('page.home.logCount'),
      value: overview?.logCount ?? 0
    },
    {
      color: '#fa8c16',
      icon: 'ant-design:notification-outlined',
      key: 'noticeCount',
      title: t('page.home.noticeCount'),
      value: overview?.noticeCount ?? 0
    },
    {
      color: '#13c2c2',
      icon: 'ant-design:safety-outlined',
      key: 'roleCount',
      title: t('page.home.roleCount'),
      value: overview?.roleCount ?? 0
    },
    {
      color: '#eb2f96',
      icon: 'ant-design:apartment-outlined',
      key: 'deptCount',
      title: t('page.home.deptCount'),
      value: overview?.deptCount ?? 0
    },
    {
      color: '#52c41a',
      icon: 'ant-design:login-outlined',
      key: 'todayLogin',
      title: t('page.home.todayLogin'),
      value: overview?.todayLoginCount ?? 0
    },
    {
      color: '#2f54eb',
      icon: 'ant-design:control-outlined',
      key: 'todayOperation',
      title: t('page.home.todayOperation'),
      value: overview?.todayOperationCount ?? 0
    }
  ];

  return (
    <ARow gutter={[16, 16]}>
      {cards.map(({ key, ...card }) => (
        <ACol
          key={key}
          lg={3}
          md={6}
          sm={12}
          span={24}
        >
          <ASpin spinning={loading}>
            <MetricCard {...card} />
          </ASpin>
        </ACol>
      ))}
    </ARow>
  );
};

export default MetricCards;
