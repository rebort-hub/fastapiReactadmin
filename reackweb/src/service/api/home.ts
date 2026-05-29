import dayjs from 'dayjs';

import { MAX_PAGE_SIZE } from '@/constants/pagination';

import { fetchGetDeptTree } from './dept';
import { fetchGetLogList } from './log';
import { fetchGetNoticeAvailable, fetchGetNoticeList } from './notice';
import { fetchGetOnlineUserList } from './online';
import { fetchGetRoleList } from './role';
import { fetchGetUserList } from './user';

function isTodayLog(createdTime?: string) {
  if (!createdTime) {
    return false;
  }
  return dayjs(createdTime).isSame(dayjs(), 'day');
}

function countDeptNodes(depts: Api.SystemModule.Dept[] = []) {
  return depts.reduce((sum, dept) => sum + 1 + countDeptNodes(dept.children ?? []), 0);
}

function computeTodayStats(logs: Api.SystemModule.Log[]) {
  let todayLoginCount = 0;
  let todayOperationCount = 0;

  logs.forEach(log => {
    if (!isTodayLog(log.created_time)) {
      return;
    }
    if (log.type === 1) {
      todayLoginCount += 1;
    } else if (log.type === 2) {
      todayOperationCount += 1;
    }
  });

  return { todayLoginCount, todayOperationCount };
}

/** 无权限或请求失败时返回默认值，避免触发全局登出 */
async function safeTotal(fetchPage: () => Promise<{ total: number }>) {
  try {
    const page = await fetchPage();
    return page.total;
  } catch {
    return 0;
  }
}

async function safeLogRecords() {
  try {
    const page = await fetchGetLogList({ current: 1, size: MAX_PAGE_SIZE });
    return page.records;
  } catch {
    return [];
  }
}

async function safeDeptCount() {
  try {
    const depts = await fetchGetDeptTree();
    return countDeptNodes(depts ?? []);
  } catch {
    return 0;
  }
}

async function safeNoticeAvailableTotal() {
  try {
    const page = await fetchGetNoticeAvailable();
    return page.total;
  } catch {
    return 0;
  }
}

/** 首页概览统计 */
export async function fetchGetHomeOverview(): Promise<Api.SystemModule.HomeOverview> {
  const dashboard = await fetchGetHomeDashboard();
  return dashboard.overview;
}

/** 首页已启用公告 */
export function fetchGetHomeNotices() {
  return fetchGetNoticeAvailable();
}

/** 首页日志趋势（最近 100 条，用于图表聚合） */
export async function fetchGetHomeLogTrend() {
  return safeLogRecords();
}

/** 首页仪表盘数据（概览 + 日志） */
export async function fetchGetHomeDashboard() {
  const [onlineCount, userCount, logCount, noticeCount, roleCount, deptCount, availableNoticeCount, logRecords] =
    await Promise.all([
      safeTotal(() => fetchGetOnlineUserList({ current: 1, size: 1 })),
      safeTotal(() => fetchGetUserList({ current: 1, size: 1 })),
      safeTotal(() => fetchGetLogList({ current: 1, size: 1 })),
      safeTotal(() => fetchGetNoticeList({ current: 1, size: 1 })),
      safeTotal(() => fetchGetRoleList({ current: 1, size: 1 })),
      safeDeptCount(),
      safeNoticeAvailableTotal(),
      safeLogRecords()
    ]);

  const todayStats = computeTodayStats(logRecords);

  const overview: Api.SystemModule.HomeOverview = {
    availableNoticeCount,
    deptCount,
    logCount,
    noticeCount,
    onlineCount,
    roleCount,
    userCount,
    ...todayStats
  };

  return { logs: logRecords, overview };
}
