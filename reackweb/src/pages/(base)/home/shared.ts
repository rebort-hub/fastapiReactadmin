import dayjs from 'dayjs';

const HOUR_BUCKETS = ['06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00', '24:00'] as const;

export type ChartPair = { name: string; value: number };

function parseLogHour(createdTime?: string) {
  if (!createdTime) {
    return null;
  }

  const hour = Number(createdTime.slice(11, 13));
  return Number.isNaN(hour) ? null : hour;
}

function bucketIndex(hour: number) {
  if (hour < 6) {
    return 0;
  }
  if (hour >= 24) {
    return HOUR_BUCKETS.length - 1;
  }
  return Math.min(Math.floor((hour - 6) / 2), HOUR_BUCKETS.length - 1);
}

export function isTodayLog(createdTime?: string) {
  if (!createdTime) {
    return false;
  }
  return dayjs(createdTime).isSame(dayjs(), 'day');
}

/** 按时间段聚合登录/操作日志数量 */
export function buildLogTrendChartData(logs: Api.SystemModule.Log[]) {
  const loginCounts = Array.from({ length: HOUR_BUCKETS.length }, () => 0);
  const operationCounts = Array.from({ length: HOUR_BUCKETS.length }, () => 0);

  logs.forEach(log => {
    const hour = parseLogHour(log.created_time);
    if (hour === null) {
      return;
    }

    const index = bucketIndex(hour);
    if (log.type === 1) {
      loginCounts[index] += 1;
    } else if (log.type === 2) {
      operationCounts[index] += 1;
    }
  });

  return {
    loginCounts,
    operationCounts,
    xAxis: [...HOUR_BUCKETS]
  };
}

/** 近 7 天日志趋势 */
export function buildLast7DaysTrend(logs: Api.SystemModule.Log[]) {
  const days = Array.from({ length: 7 }, (_, index) => dayjs().subtract(6 - index, 'day'));
  const labels = days.map(item => item.format('MM-DD'));
  const loginCounts = days.map(() => 0);
  const operationCounts = days.map(() => 0);

  logs.forEach(log => {
    if (!log.created_time) {
      return;
    }
    const logDay = dayjs(log.created_time).format('YYYY-MM-DD');
    const dayIndex = days.findIndex(item => item.format('YYYY-MM-DD') === logDay);
    if (dayIndex < 0) {
      return;
    }
    if (log.type === 1) {
      loginCounts[dayIndex] += 1;
    } else if (log.type === 2) {
      operationCounts[dayIndex] += 1;
    }
  });

  const totalLogin = loginCounts.reduce((sum, value) => sum + value, 0);
  const totalOperation = operationCounts.reduce((sum, value) => sum + value, 0);
  const total = totalLogin + totalOperation;
  const passRate = total ? Number(((totalLogin / total) * 100).toFixed(2)) : 0;

  return {
    labels,
    loginCounts,
    operationCounts,
    passRate,
    total,
    totalLogin,
    totalOperation
  };
}

/** 按日志类型聚合饼图数据 */
export function buildLogTypePieData(logs: Api.SystemModule.Log[]) {
  let loginCount = 0;
  let operationCount = 0;

  logs.forEach(log => {
    if (log.type === 1) {
      loginCount += 1;
    } else if (log.type === 2) {
      operationCount += 1;
    }
  });

  return { loginCount, operationCount };
}

function aggregateByField(logs: Api.SystemModule.Log[], getKey: (log: Api.SystemModule.Log) => string) {
  const map = new Map<string, number>();

  logs.forEach(log => {
    const key = getKey(log);
    map.set(key, (map.get(key) ?? 0) + 1);
  });

  return [...map.entries()]
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

/** 浏览器分布 */
export function buildBrowserDistribution(logs: Api.SystemModule.Log[]) {
  return aggregateByField(logs, log => log.request_browser || 'Unknown');
}

/** 登录地区 Top10 */
export function buildRegionTop10(logs: Api.SystemModule.Log[]) {
  return aggregateByField(
    logs.filter(log => log.type === 1),
    log => log.login_location || 'Unknown'
  ).slice(0, 10);
}

/** 请求方法分布 */
export function buildRequestMethodDistribution(logs: Api.SystemModule.Log[]) {
  return aggregateByField(logs, log => log.request_method?.toUpperCase() || 'UNKNOWN');
}

/** 模块分布（按 request_path 第二段） */
export function buildModuleDistribution(logs: Api.SystemModule.Log[]) {
  return aggregateByField(logs, log => {
    const segments = (log.request_path || '').split('/').filter(Boolean);
    if (segments.length >= 3) {
      return segments[2];
    }
    return 'other';
  });
}

/** 响应状态分布 */
export function buildResponseCodeDistribution(logs: Api.SystemModule.Log[]) {
  return aggregateByField(logs, log => {
    const code = log.response_code;
    if (!code) {
      return 'Unknown';
    }
    if (code >= 200 && code < 300) {
      return '2xx';
    }
    if (code >= 400 && code < 500) {
      return '4xx';
    }
    if (code >= 500) {
      return '5xx';
    }
    return String(code);
  });
}

/** 每日登录/操作迷你趋势（近 7 天） */
export function buildDailyTypeSparkline(logs: Api.SystemModule.Log[], type: 1 | 2) {
  const filtered = logs.filter(log => log.type === type);
  const trend = buildLast7DaysTrend(filtered);
  const data = type === 1 ? trend.loginCounts : trend.operationCounts;
  const total = data.reduce((sum, value) => sum + value, 0);

  return {
    data,
    labels: trend.labels,
    total
  };
}

export { HOUR_BUCKETS };
