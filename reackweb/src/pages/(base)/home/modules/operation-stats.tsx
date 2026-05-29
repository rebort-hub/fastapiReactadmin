import { useLang } from '@/features/lang';

import { buildLast7DaysTrend, buildModuleDistribution, buildRequestMethodDistribution } from '../shared';
import { useHomeData } from '../use-home-data';

function DonutChart({ data, title }: { data: { name: string; value: number }[]; title: string }) {
  const { t } = useTranslation();

  const { domRef, updateOptions } = useEcharts(() => ({
    color: ['#1677ff', '#52c41a', '#faad14', '#ff4d4f', '#722ed1', '#13c2c2'],
    legend: {
      bottom: 0,
      left: 'center',
      type: 'scroll'
    },
    series: [
      {
        center: ['50%', '42%'],
        data: [] as { name: string; value: number }[],
        label: { formatter: '{b}\n{d}%' },
        radius: ['42%', '62%'],
        type: 'pie'
      }
    ],
    title: {
      left: 'center',
      text: title,
      textStyle: { fontSize: 14, fontWeight: 500 }
    },
    tooltip: { trigger: 'item' }
  }));

  useEffect(() => {
    updateOptions(opts => {
      opts.series[0].data = data.length ? data : [{ name: t('page.home.noData'), value: 0 }];
      return opts;
    });
  }, [data, t]);

  return (
    <div
      className="h-300px"
      ref={domRef}
    />
  );
}

const OperationStatsSection = () => {
  const { t } = useTranslation();
  const { locale } = useLang();
  const { data, loading } = useHomeData();
  const logs = data?.logs ?? [];

  const methodPie = useMemo(() => buildRequestMethodDistribution(logs), [logs]);
  const modulePie = useMemo(() => buildModuleDistribution(logs), [logs]);
  const trend = useMemo(() => buildLast7DaysTrend(logs.filter(item => item.type === 2)), [logs]);

  const { domRef, updateOptions } = useEcharts(() => ({
    color: ['#1677ff', '#52c41a'],
    grid: { bottom: '8%', containLabel: true, left: '3%', right: '3%', top: '16%' },
    legend: {
      data: [t('page.home.operationCount'), t('page.home.operationUsers')]
    },
    series: [
      {
        data: [] as number[],
        name: t('page.home.operationCount'),
        smooth: true,
        type: 'line'
      },
      {
        data: [] as number[],
        name: t('page.home.operationUsers'),
        smooth: true,
        type: 'line'
      }
    ],
    tooltip: { trigger: 'axis' },
    xAxis: { boundaryGap: false, data: [] as string[], type: 'category' },
    yAxis: { type: 'value' }
  }));

  useEffect(() => {
    updateOptions(opts => {
      opts.xAxis.data = trend.labels;
      opts.series[0].data = trend.operationCounts;
      opts.series[1].data = trend.loginCounts;
      return opts;
    });
  }, [trend, locale, t]);

  return (
    <ACard
      className="card-wrapper"
      loading={loading}
      title={t('page.home.operationStatsTitle')}
      variant="borderless"
    >
      <ARow gutter={[16, 16]}>
        <ACol
          lg={6}
          md={12}
          span={24}
        >
          <DonutChart
            data={methodPie}
            title={t('page.home.requestMethodDistribution')}
          />
        </ACol>
        <ACol
          lg={6}
          md={12}
          span={24}
        >
          <DonutChart
            data={modulePie}
            title={t('page.home.moduleDistribution')}
          />
        </ACol>
        <ACol
          lg={12}
          span={24}
        >
          <div className="mb-8px text-14px font-500">{t('page.home.recentOperationTrend')}</div>
          <div
            className="h-300px"
            ref={domRef}
          />
        </ACol>
      </ARow>
    </ACard>
  );
};

export default OperationStatsSection;
