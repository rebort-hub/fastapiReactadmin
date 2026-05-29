import { localStg } from '@/utils/storage';

function readStore(): Record<string, number[]> {
  return localStg.get('noticeReadIds') ?? {};
}

function writeStore(store: Record<string, number[]>) {
  localStg.set('noticeReadIds', store);
}

export function getReadNoticeIds(userId: string | number | undefined) {
  if (userId === undefined || userId === null || userId === '') {
    return new Set<number>();
  }
  const key = String(userId);
  return new Set(readStore()[key] ?? []);
}

export function markNoticeRead(userId: string | number | undefined, noticeId: number) {
  if (userId === undefined || userId === null || userId === '') {
    return new Set<number>();
  }
  const key = String(userId);
  const store = readStore();
  const ids = new Set(store[key] ?? []);
  ids.add(noticeId);
  store[key] = [...ids];
  writeStore(store);
  return ids;
}

export function markAllNoticesRead(userId: string | number | undefined, noticeIds: number[]) {
  if (userId === undefined || userId === null || userId === '' || !noticeIds.length) {
    return getReadNoticeIds(userId);
  }
  const key = String(userId);
  const store = readStore();
  const ids = new Set([...(store[key] ?? []), ...noticeIds]);
  store[key] = [...ids];
  writeStore(store);
  return ids;
}

export function isNoticeRead(userId: string | number | undefined, noticeId: number, readIds?: Set<number>) {
  const set = readIds ?? getReadNoticeIds(userId);
  return set.has(noticeId);
}
