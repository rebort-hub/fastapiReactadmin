import { request } from '../request';
import { SYSTEM_MODULE_URLS } from '../urls/system-module';

/** 缓存监控统计 */
export function fetchGetCacheInfo() {
  return request<Api.SystemModule.CacheMonitor>({
    method: 'get',
    url: SYSTEM_MODULE_URLS.CACHE_INFO
  });
}

/** 缓存名称列表 */
export function fetchGetCacheNames() {
  return request<Api.SystemModule.CacheInfo[]>({
    method: 'get',
    url: SYSTEM_MODULE_URLS.CACHE_NAMES
  });
}

/** 指定缓存名称下的键名列表 */
export function fetchGetCacheKeys(cacheName: string) {
  return request<string[]>({
    method: 'get',
    url: SYSTEM_MODULE_URLS.CACHE_KEYS(cacheName)
  });
}

/** 缓存键值 */
export function fetchGetCacheValue(cacheName: string, cacheKey: string) {
  return request<Api.SystemModule.CacheInfo>({
    method: 'get',
    url: SYSTEM_MODULE_URLS.CACHE_VALUE(cacheName, cacheKey)
  });
}

/** 清除指定缓存名称下所有键 */
export function fetchClearCacheByName(cacheName: string) {
  return request<null>({
    method: 'delete',
    url: SYSTEM_MODULE_URLS.CACHE_DELETE_NAME(cacheName)
  });
}

/** 清除指定键 */
export function fetchClearCacheByKey(cacheKey: string) {
  return request<null>({
    method: 'delete',
    url: SYSTEM_MODULE_URLS.CACHE_DELETE_KEY(cacheKey)
  });
}

/** 清除全部缓存 */
export function fetchClearAllCache() {
  return request<null>({
    method: 'delete',
    url: SYSTEM_MODULE_URLS.CACHE_DELETE_ALL
  });
}
