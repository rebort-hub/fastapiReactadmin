import { useLang } from '@/features/lang';

import {
  buildBrowserDistribution,
  buildDailyTypeSparkline,
  buildLogTypePieData,
  buildRegionTop10
} from '../shared';
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
      className="h-280px"
      ref={domRef}
    />
  );
}

function RegionBarChart({ data }: { data: { name: string; value: number }[] }) {
  const { t } = useTranslation();

  const { domRef, updateOptions } = useEcharts(() => ({
    grid: { bottom: '3%', containLabel: true, left: '3%', right: '8%', top: '12%' },
    series: [
      {
        data: [] as number[],
        itemStyle: { borderRadius: [0, 4, 4, 0], color: '#1677ff' },
        type: 'bar'
      }
    ],
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'value' },
    yAxis: { data: [] as string[], inverse: true, type: 'category' }
  }));

  useEffect(() => {
    updateOptions(opts => {
      opts.yAxis.data = data.map(item => item.name);
      opts.series[0].data = data.map(item => item.value);
      return opts;
    });
  }, [data]);

  return (
    <div
      className="h-280px"
      ref={domRef}
    />
  );
}

function SparklineCard({ color, data, title, total }: { color: string; data: number[]; title: string; total: number }) {
  const { domRef, updateOptions } = useEcharts(() => ({
    grid: { bottom: 0, left: 0, right: 0, top: 0 },
    series: [
      {
        areaStyle: { color: `${color}33` },
        data: [] as number[],
        lineStyle: { color, width: 2 },
        showSymbol: false,
        smooth: true,
        type: 'line'
      }
    ],
    xAxis: { show: false, type: 'category' },
    yAxis: { show: false, type: 'value' }
  }));

  useEffect(() => {
    updateOptions(opts => {
      opts.series[0].data = data.length ? data : [0];
      return opts;
    });
  }, [data]);

  return (
    <div className="h-full rd-10px bg-#fafafa px-14px py-12px">
      <div className="text-12px text-gray-500">{title}</div>
      <div
        className="text-22px font-700"
        style={{ color }}
      >
        {total}
      </div>
      <div
        className="h-56px"
        ref={domRef}
      />
    </div>
  );
}

const LoginAnalysisSection = () => {
  const { t } = useTranslation();
  const { locale } = useLang();
  const { data, loading } = useHomeData();
  const logs = data?.logs ?? [];

  const loginLogs = useMemo(() => logs.filter(item => item.type === 1), [logs]);
  const typePie = useMemo(() => {
    const { loginCount, operationCount } = buildLogTypePieData(logs);
    return [
      { name: t('page.manage.log.typeLogin'), value: loginCount },
      { name: t('page.manage.log.typeOperation'), value: operationCount }
    ];
  }, [logs, locale, t]);
  const browserPie = useMemo(() => buildBrowserDistribution(loginLogs), [loginLogs]);
  const regionTop = useMemo(() => buildRegionTop10(logs), [logs]);
  const loginSpark = useMemo(() => buildDailyTypeSparkline(logs, 1), [logs]);
  const operationSpark = useMemo(() => buildDailyTypeSparkline(logs, 2), [logs]);

  return (
    <ACard
      className="card-wrapper"
      loading={loading}
      title={t('page.home.loginAnalysisTitle')}
      variant="borderless"
    >
      <ARow gutter={[16, 16]}>
        <ACol
          lg={6}
          md={12}
          span={24}
        >
          <DonutChart
            data={typePie}
            title={t('page.home.operationTypeDistribution')}
          />
        </ACol>
        <ACol
          lg={6}
          md={12}
          span={24}
        >
          <DonutChart
            data={browserPie}
            title={t('page.home.browserDistribution')}
          />
        </ACol>
        <ACol
          lg={8}
          md={12}
          span={24}
        >
          <div className="mb-8px text-14px font-500">{t('page.home.regionTop10')}</div>
          <RegionBarChart data={regionTop} />
        </ACol>
        <ACol
          lg={4}
          md={12}
          span={24}
        >
          <ASpace
            className="w-full"
            direction="vertical"
            size={12}
          >
            <SparklineCard
              color="#1677ff"
              data={loginSpark.data}
              title={t('page.home.dailyLoginTotal')}
              total={loginSpark.total}
            />
            <SparklineCard
              color="#52c41a"
              data={operationSpark.data}
              title={t('page.home.dailyOperationTotal')}
              total={operationSpark.total}
            />
          </ASpace>
        </ACol>
      </ARow>
    </ACard>
  );
};

export default LoginAnalysisSection;
