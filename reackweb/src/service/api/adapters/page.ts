/** 将 FastAPI 分页结构适配为 useTable 所需格式 */

import { DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } from '@/constants/pagination';

export type BackendPageResult<T> = {
  items?: T[];
  total?: number;
  page_no?: number;
  page_size?: number;
};

export type TablePageParams = {
  current?: number | null;
  size?: number | null;
};

export function normalizePageSize(size?: number | null) {
  const value = size ?? DEFAULT_PAGE_SIZE;
  return Math.min(Math.max(1, value), MAX_PAGE_SIZE);
}

export function toBackendPageParams(params?: TablePageParams & Record<string, unknown> | null) {
  const { current = 1, size, ...rest } = params ?? {};
  const query: Record<string, unknown> = {
    page_no: current,
    page_size: normalizePageSize(size)
  };

  Object.entries(rest).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      query[key] = value;
    }
  });

  return query;
}

export function adaptBackendPage<T>(
  page: BackendPageResult<T> | null | undefined,
  params?: TablePageParams | null
) {
  const current = params?.current ?? page?.page_no ?? 1;
  const size = normalizePageSize(params?.size ?? page?.page_size);

  return {
    current,
    records: page?.items ?? [],
    size,
    total: page?.total ?? 0
  };
}

/** 拉取全部分页数据（每页不超过 MAX_PAGE_SIZE） */
export async function fetchAllBackendPages<T>(
  fetchPage: (params: { current: number; size: number }) => Promise<BackendPageResult<T>>
) {
  const all: T[] = [];
  let current = 1;
  let total = 0;

  do {
    const page = await fetchPage({ current, size: MAX_PAGE_SIZE });
    all.push(...(page?.items ?? []));
    total = page?.total ?? all.length;
    current += 1;
  } while (all.length < total);

  return all;
}
