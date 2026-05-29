import { request } from '../request';
import { SYSTEM_MODULE_URLS } from '../urls/system-module';

/** 服务器监控信息 */
export function fetchGetServerInfo() {
  return request<Api.SystemModule.ServerMonitor>({
    method: 'get',
    url: SYSTEM_MODULE_URLS.SERVER_INFO
  });
}
