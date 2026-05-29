import { useRequest } from 'ahooks';
import { useMemo, useState } from 'react';

import Auth from '@/components/Auth';
import { Perm } from '@/constants/permissions';
import type { ECOption } from '@/hooks/common/echarts';
import { useEcharts } from '@/hooks/common/echarts';
import {
  fetchClearAllCache,
  fetchClearCacheByKey,
  fetchClearCacheByName,
  fetchGetCacheInfo,
  fetchGetCacheKeys,
  fetchGetCacheNames,
  fetchGetCacheValue
} from '@/service/api';

function formatCacheValue(value: unknown) {
  if (value === null || value === undefined) {
    return '';
  }
  if (typeof value === 'object') {
    try {
      return JSON.stringify(value, null, 2);
    } catch {
      return String(value);
    }
  }
  return String(value);
}

const CacheMonitor = () => {
  const { t } = useTranslation();

  const [activeTab, setActiveTab] = useState('monitor');
  const [selectedCacheName, setSelectedCacheName] = useState('');
  const [cacheKeys, setCacheKeys] = useState<string[]>([]);
  const [cacheForm, setCacheForm] = useState({
    cache_key: '',
    cache_name: '',
    cache_value: ''
  });

  const {
    data: monitor,
    loading: monitorLoading,
    refresh: refreshMonitor
  } = useRequest(fetchGetCacheInfo, { ready: activeTab === 'monitor' });

  const {
    data: cacheNames = [],
    loading: namesLoading,
    refresh: refreshNames
  } = useRequest(fetchGetCacheNames, { ready: activeTab === 'manage' });

  const info = monitor?.info ?? {};

  const commandStatsOption = useMemo((): ECOption => {
    const stats = monitor?.command_stats ?? [];
    return {
      series: [
        {
          data: stats.map(item => Number(item.value) || 0),
          type: 'bar'
        }
      ],
      tooltip: { trigger: 'axis' },
      xAxis: {
        axisLabel: { interval: 0, rotate: 30 },
        data: stats.map(item => item.name),
        type: 'category'
      },
      yAxis: { type: 'value' }
    };
  }, [monitor?.command_stats]);

  const memoryOption = useMemo((): ECOption => {
    const used = String(info.used_memory_human ?? '0');
    const max = String(info.maxmemory_human ?? '0');
    const usedNum = Number.parseFloat(used) || 0;
    const maxNum = Number.parseFloat(max) || usedNum || 1;

    return {
      series: [
        {
          data: [
            { name: t('page.manage.cache.usedMemory'), value: usedNum },
            { name: t('page.manage.cache.maxMemory'), value: Math.max(maxNum - usedNum, 0) }
          ],
          label: { formatter: '{b}: {c}' },
          radius: ['40%', '70%'],
          type: 'pie'
        }
      ],
      tooltip: { trigger: 'item' }
    };
  }, [info.maxmemory_human, info.used_memory_human, t]);

  const { domRef: commandChartRef } = useEcharts(() => commandStatsOption);
  const { domRef: memoryChartRef } = useEcharts(() => memoryOption);

  async function loadCacheKeys(cacheName: string) {
    setSelectedCacheName(cacheName);
    const keys = await fetchGetCacheKeys(cacheName);
    setCacheKeys(keys ?? []);
    setCacheForm({ cache_key: '', cache_name: cacheName, cache_value: '' });
  }

  async function loadCacheValue(cacheKey: string) {
    if (!selectedCacheName) {
      return;
    }
    const result = await fetchGetCacheValue(selectedCacheName, cacheKey);
    setCacheForm({
      cache_key: cacheKey,
      cache_name: selectedCacheName,
      cache_value: formatCacheValue(result?.cache_value)
    });
  }

  async function handleClearCacheName(cacheName: string) {
    await fetchClearCacheByName(cacheName);
    window.$message?.success(t('common.deleteSuccess'));
    if (selectedCacheName === cacheName) {
      setSelectedCacheName('');
      setCacheKeys([]);
      setCacheForm({ cache_key: '', cache_name: '', cache_value: '' });
    }
    refreshNames();
  }

  async function handleClearCacheKey(cacheKey: string) {
    await fetchClearCacheByKey(cacheKey);
    window.$message?.success(t('common.deleteSuccess'));
    if (selectedCacheName) {
      await loadCacheKeys(selectedCacheName);
    }
    setCacheForm(prev => (prev.cache_key === cacheKey ? { ...prev, cache_key: '', cache_value: '' } : prev));
  }

  async function handleClearAll() {
    await fetchClearAllCache();
    window.$message?.success(t('common.deleteSuccess'));
    setSelectedCacheName('');
    setCacheKeys([]);
    setCacheForm({ cache_key: '', cache_name: '', cache_value: '' });
    refreshNames();
  }

  const monitorItems = [
    { label: t('page.manage.cache.redisVersion'), value: info.redis_version },
    {
      label: t('page.manage.cache.redisMode'),
      value: info.redis_mode === 'standalone' ? t('page.manage.cache.modeStandalone') : info.redis_mode
    },
    { label: t('page.manage.cache.port'), value: info.tcp_port },
    { label: t('page.manage.cache.clients'), value: info.connected_clients },
    { label: t('page.manage.cache.uptimeDays'), value: info.uptime_in_days },
    { label: t('page.manage.cache.usedMemory'), value: info.used_memory_human },
    { label: t('page.manage.cache.maxMemory'), value: info.maxmemory_human },
    {
      label: t('page.manage.cache.aof'),
      value: info.aof_enabled === '0' ? t('page.manage.cache.aofOff') : t('page.manage.cache.aofOn')
    },
    { label: t('page.manage.cache.rdbStatus'), value: info.rdb_last_bgsave_status },
    { label: t('page.manage.cache.keyCount'), value: monitor?.db_size },
    {
      label: t('page.manage.cache.networkIo'),
      value: `${info.instantaneous_input_kbps ?? 0}kps / ${info.instantaneous_output_kbps ?? 0}kps`
    }
  ];

  return (
    <div className="h-full min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
      <ACard
        className="card-wrapper flex-1"
        title={t('page.manage.cache.title')}
        variant="borderless"
      >
        <ATabs
          activeKey={activeTab}
          items={[
            {
              children: (
                <div className="flex-col-stretch gap-16px">
                  <AFlex justify="end">
                    <AButton
                      loading={monitorLoading}
                      onClick={refreshMonitor}
                    >
                      {t('common.refresh')}
                    </AButton>
                  </AFlex>
                  <ADescriptions
                    bordered
                    column={3}
                    items={monitorItems.map(item => ({
                      children: String(item.value ?? '-'),
                      key: String(item.label),
                      label: item.label
                    }))}
                  />
                  <ARow gutter={16}>
                    <ACol span={12}>
                      <ACard
                        size="small"
                        title={t('page.manage.cache.commandStats')}
                      >
                        <div
                          className="h-280px"
                          ref={commandChartRef}
                        />
                      </ACard>
                    </ACol>
                    <ACol span={12}>
                      <ACard
                        size="small"
                        title={t('page.manage.cache.memoryInfo')}
                      >
                        <div
                          className="h-280px"
                          ref={memoryChartRef}
                        />
                      </ACard>
                    </ACol>
                  </ARow>
                </div>
              ),
              key: 'monitor',
              label: t('page.manage.cache.tabMonitor')
            },
            {
              children: (
                <div className="flex-col-stretch gap-12px">
                  <AFlex justify="end">
                    <Auth perm={Perm.Cache.delete}>
                      <AButton
                        danger
                        onClick={handleClearAll}
                      >
                        {t('page.manage.cache.clearAll')}
                      </AButton>
                    </Auth>
                    <AButton
                      loading={namesLoading}
                      onClick={refreshNames}
                    >
                      {t('common.refresh')}
                    </AButton>
                  </AFlex>
                  <ARow gutter={16}>
                    <ACol span={8}>
                      <ACard
                        size="small"
                        title={t('page.manage.cache.cacheList')}
                      >
                        <ATable
                          columns={[
                            {
                              dataIndex: 'cache_name',
                              key: 'cache_name',
                              render: (_, record) => (
                                <AButton
                                  type="link"
                                  onClick={() => loadCacheKeys(record.cache_name)}
                                >
                                  {record.cache_name}
                                </AButton>
                              ),
                              title: t('page.manage.cache.cacheName')
                            },
                            { dataIndex: 'remark', ellipsis: true, key: 'remark', title: t('page.manage.cache.remark') },
                            {
                              align: 'center',
                              key: 'operate',
                              render: (_, record) => (
                                <Auth perm={Perm.Cache.delete}>
                                  <APopconfirm
                                    title={t('common.confirmDelete')}
                                    onConfirm={() => handleClearCacheName(record.cache_name)}
                                  >
                                    <AButton
                                      danger
                                      size="small"
                                      type="link"
                                    >
                                      {t('common.delete')}
                                    </AButton>
                                  </APopconfirm>
                                </Auth>
                              ),
                              width: 70
                            }
                          ]}
                          dataSource={cacheNames}
                          loading={namesLoading}
                          pagination={false}
                          rowKey="cache_name"
                          size="small"
                        />
                      </ACard>
                    </ACol>
                    <ACol span={8}>
                      <ACard
                        size="small"
                        title={t('page.manage.cache.keyList')}
                      >
                        <ATable
                          columns={[
                            {
                              dataIndex: 'cacheKey',
                              key: 'cacheKey',
                              render: (cacheKey: string) => (
                                <AButton
                                  type="link"
                                  onClick={() => loadCacheValue(cacheKey)}
                                >
                                  {cacheKey}
                                </AButton>
                              ),
                              title: t('page.manage.cache.cacheKey')
                            },
                            {
                              align: 'center',
                              key: 'operate',
                              render: (_, record) => (
                                <Auth perm={Perm.Cache.delete}>
                                  <APopconfirm
                                    title={t('common.confirmDelete')}
                                    onConfirm={() => handleClearCacheKey(record.cacheKey)}
                                  >
                                    <AButton
                                      danger
                                      size="small"
                                      type="link"
                                    >
                                      {t('common.delete')}
                                    </AButton>
                                  </APopconfirm>
                                </Auth>
                              ),
                              width: 70
                            }
                          ]}
                          dataSource={cacheKeys.map(cacheKey => ({ cacheKey }))}
                          pagination={false}
                          rowKey="cacheKey"
                          size="small"
                        />
                      </ACard>
                    </ACol>
                    <ACol span={8}>
                      <ACard
                        size="small"
                        title={t('page.manage.cache.cacheContent')}
                      >
                        <AForm layout="vertical">
                          <AForm.Item label={t('page.manage.cache.cacheName')}>
                            <AInput
                              readOnly
                              value={cacheForm.cache_name}
                            />
                          </AForm.Item>
                          <AForm.Item label={t('page.manage.cache.cacheKey')}>
                            <AInput
                              readOnly
                              value={cacheForm.cache_key}
                            />
                          </AForm.Item>
                          <AForm.Item label={t('page.manage.cache.cacheValue')}>
                            <AInput.TextArea
                              readOnly
                              rows={12}
                              value={cacheForm.cache_value}
                            />
                          </AForm.Item>
                        </AForm>
                      </ACard>
                    </ACol>
                  </ARow>
                </div>
              ),
              key: 'manage',
              label: t('page.manage.cache.tabManage')
            }
          ]}
          onChange={setActiveTab}
        />
      </ACard>
    </div>
  );
};

export default CacheMonitor;
