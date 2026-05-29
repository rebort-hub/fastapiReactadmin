import { useRequest } from 'ahooks';

import { fetchGetHomeDashboard } from '@/service/api';

const HOME_CACHE_KEY = 'home-dashboard';

export function useHomeData() {
  return useRequest(fetchGetHomeDashboard, {
    cacheKey: HOME_CACHE_KEY
  });
}
