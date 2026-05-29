import { useLang } from '@/features/lang';

import { buildLast7DaysTrend } from '../shared';
import { useHomeData } from '../use-home-data';

type TrendTab = 'all' | 'login' | 'operation';

const LogTrendPanel = () => {
  const { t } = useTranslation();
  const { locale } = useLang();
  const { data, loading } = useHomeData();

  const [tab, setTab] = useState<TrendTab>('all');
  const logs = data?.logs ?? [];

  const { domRef, updateOptions } = useEcharts(() => ({
    color: ['#52c41a', '#ff4d4f'],
    grid: {
      bottom: '8%',
      containLabel: true,
      left: '3%',
      right: '3%',
      top: '18%'
    },
    legend: {
      data: [t('page.home.trendSuccess'), t('page.home.trendFailure')]
    },
    series: [
      {
        areaStyle: { opacity: 0.25 },
        data: [] as number[],
        name: t('page.home.trendSuccess'),
        smooth: true,
        stack: 'total',
        type: 'line'
      },
      {
        areaStyle: { opacity: 0.18 },
        data: [] as number[],
        name: t('page.home.trendFailure'),
        smooth: true,
        stack: 'total',
        type: 'line'
      }
    ],
    tooltip: { trigger: 'axis' },
    xAxis: {
      boundaryGap: false,
      data: [] as string[],
      type: 'category'
    },
    yAxis: { type: 'value' }
  }));

  function applyChart(records: Api.SystemModule.Log[], currentTab: TrendTab) {
    const source =
      currentTab === 'login'
        ? records.filter(item => item.type === 1)
        : currentTab === 'operation'
          ? records.filter(item => item.type === 2)
          : records;
    const trend = buildLast7DaysTrend(source.length ? source : records);

    updateOptions(opts => {
      opts.xAxis.data = trend.labels;
      opts.series[0].data = trend.loginCounts;
      opts.series[1].data = trend.operationCounts;
      opts.legend.data = [t('page.home.logTrendLogin'), t('page.home.logTrendOperation')];
      opts.series[0].name = t('page.home.logTrendLogin');
      opts.series[1].name = t('page.home.logTrendOperation');
      return opts;
    });
  }

  useEffect(() => {
    if (logs.length) {
      applyChart(logs, tab);
    }
  }, [logs, tab]);

  useUpdateEffect(() => {
    applyChart(logs, tab);
  }, [locale]);

  const trend = buildLast7DaysTrend(
    tab === 'login' ? logs.filter(item => item.type === 1) : tab === 'operation' ? logs.filter(item => item.type === 2) : logs
  );

  const summaryItems = [
    { label: t('page.home.totalExecutions'), value: trend.total },
    { label: t('page.home.trendSuccess'), value: trend.totalLogin },
    { label: t('page.home.trendFailure'), value: trend.totalOperation },
    { label: t('page.home.passRate'), value: `${trend.passRate}%` }
  ];

  return (
    <ACard
      className="card-wrapper h-full"
      loading={loading}
      title={t('page.home.logTrendTitle')}
      variant="borderless"
      extra={
        <ASegmented
          options={[
            { label: t('page.home.tabAll'), value: 'all' },
            { label: t('page.home.tabLogin'), value: 'login' },
            { label: t('page.home.tabOperation'), value: 'operation' }
          ]}
          value={tab}
          onChange={value => setTab(value as TrendTab)}
        />
      }
    >
      <div className="mb-16px flex flex-wrap gap-24px">
        {summaryItems.map(item => (
          <div key={item.label}>
            <div className="text-12px text-gray-500">{item.label}</div>
            <div className="text-20px font-600">{item.value}</div>
          </div>
        ))}
      </div>
      <div
        className="h-320px"
        ref={domRef}
      />
    </ACard>
  );
};

export default LogTrendPanel;
