import { useRequest } from 'ahooks';
import type { ProgressProps } from 'antd';

import { fetchGetServerInfo } from '@/service/api';

function displayValue(value: unknown) {
  if (value === null || value === undefined || value === '') {
    return '-';
  }
  return String(value);
}

function progressStatus(percent: number): ProgressProps['status'] {
  if (percent > 80) {
    return 'exception';
  }
  if (percent > 60) {
    return 'normal';
  }
  return 'success';
}

const ServerMonitor = () => {
  const { t } = useTranslation();

  const { data, loading, refresh } = useRequest(fetchGetServerInfo);

  const cpu = data?.cpu;
  const mem = data?.mem;
  const sys = data?.sys;
  const py = data?.py;
  const disks = data?.disks ?? [];

  return (
    <div className="h-full min-h-500px flex-col-stretch gap-16px overflow-auto">
      <ACard
        className="card-wrapper"
        extra={
          <AButton
            size="small"
            onClick={refresh}
          >
            {t('common.refresh')}
          </AButton>
        }
        loading={loading}
        title={t('page.manage.server.title')}
        variant="borderless"
      >
        <ARow gutter={[16, 16]}>
          <ACol
            lg={12}
            span={24}
          >
            <ACard
              size="small"
              title={t('page.manage.server.cpu')}
            >
              <div className="flex flex-wrap items-center gap-24px">
                <AProgress
                  format={() => `${(cpu?.used ?? 0).toFixed(1)}%`}
                  percent={cpu?.used ?? 0}
                  status={progressStatus(cpu?.used ?? 0)}
                  type="circle"
                />
                <ADescriptions
                  column={1}
                  items={[
                    { children: displayValue(cpu?.cpu_num), key: 'core', label: t('page.manage.server.cpuNum') },
                    { children: `${(cpu?.used ?? 0).toFixed(1)}%`, key: 'used', label: t('page.manage.server.cpuUsed') },
                    { children: `${(cpu?.sys ?? 0).toFixed(1)}%`, key: 'sys', label: t('page.manage.server.cpuSys') }
                  ]}
                  size="small"
                />
              </div>
            </ACard>
          </ACol>

          <ACol
            lg={12}
            span={24}
          >
            <ACard
              size="small"
              title={t('page.manage.server.memory')}
            >
              <div className="flex flex-wrap items-center gap-24px">
                <AProgress
                  format={() => `${(mem?.usage ?? 0).toFixed(1)}%`}
                  percent={mem?.usage ?? 0}
                  status={progressStatus(mem?.usage ?? 0)}
                  type="circle"
                />
                <ADescriptions
                  column={1}
                  items={[
                    { children: displayValue(mem?.total), key: 'total', label: t('page.manage.server.memTotal') },
                    { children: displayValue(mem?.used), key: 'used', label: t('page.manage.server.memUsed') },
                    { children: displayValue(mem?.free), key: 'free', label: t('page.manage.server.memFree') }
                  ]}
                  size="small"
                />
              </div>
            </ACard>
          </ACol>

          <ACol
            lg={12}
            span={24}
          >
            <ACard
              size="small"
              title={t('page.manage.server.sysInfo')}
            >
              <ADescriptions
                column={1}
                items={[
                  { children: displayValue(sys?.computer_name), key: 'name', label: t('page.manage.server.hostName') },
                  { children: displayValue(sys?.os_name), key: 'os', label: t('page.manage.server.osName') },
                  { children: displayValue(sys?.computer_ip), key: 'ip', label: t('page.manage.server.hostIp') },
                  { children: displayValue(sys?.os_arch), key: 'arch', label: t('page.manage.server.osArch') }
                ]}
                size="small"
              />
            </ACard>
          </ACol>

          <ACol
            lg={12}
            span={24}
          >
            <ACard
              size="small"
              title={t('page.manage.server.python')}
            >
              <ADescriptions
                column={1}
                items={[
                  { children: displayValue(py?.name), key: 'name', label: t('page.manage.server.pyName') },
                  { children: displayValue(py?.version), key: 'version', label: t('page.manage.server.pyVersion') },
                  { children: displayValue(py?.start_time), key: 'start', label: t('page.manage.server.pyStart') },
                  { children: displayValue(py?.run_time), key: 'run', label: t('page.manage.server.pyRunTime') },
                  { children: displayValue(py?.home), key: 'home', label: t('page.manage.server.pyHome') },
                  {
                    children: py?.memory_usage !== undefined ? `${py.memory_usage.toFixed(1)}%` : '-',
                    key: 'mem',
                    label: t('page.manage.server.pyMemory')
                  },
                  { children: displayValue(sys?.user_dir), key: 'project', label: t('page.manage.server.projectPath') }
                ]}
                size="small"
              />
            </ACard>
          </ACol>

          <ACol span={24}>
            <ACard
              size="small"
              title={t('page.manage.server.disks')}
            >
              <ATable
                dataSource={disks}
                pagination={false}
                rowKey="dir_name"
                size="small"
                columns={[
                  { dataIndex: 'dir_name', ellipsis: true, key: 'dir_name', title: t('page.manage.server.diskPath') },
                  { align: 'center', dataIndex: 'sys_type_name', key: 'sys_type_name', title: t('page.manage.server.fsType'), width: 100 },
                  { dataIndex: 'type_name', ellipsis: true, key: 'type_name', title: t('page.manage.server.diskName') },
                  {
                    align: 'center',
                    dataIndex: 'usage',
                    key: 'usage',
                    render: (_, record) => (
                      <AProgress
                        percent={record.usage}
                        size="small"
                        status={progressStatus(record.usage)}
                      />
                    ),
                    title: t('page.manage.server.diskUsage'),
                    width: 180
                  },
                  { align: 'center', dataIndex: 'total', key: 'total', title: t('page.manage.server.diskTotal'), width: 100 },
                  { align: 'center', dataIndex: 'used', key: 'used', title: t('page.manage.server.diskUsed'), width: 100 },
                  { align: 'center', dataIndex: 'free', key: 'free', title: t('page.manage.server.diskFree'), width: 100 }
                ]}
              />
            </ACard>
          </ACol>
        </ARow>
      </ACard>
    </div>
  );
};

export default ServerMonitor;
