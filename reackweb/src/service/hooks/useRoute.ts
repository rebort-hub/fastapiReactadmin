import { useQuery } from '@tanstack/react-query';

import { fetchGetBackendRoutes, fetchGetConstantRoutes, fetchIsRouteExist } from '../api';
import { QUERY_KEYS } from '../keys';

/**
 * Get constant routes hook
 *
 * @example
 *   const { data: constantRoutes, isLoading } = useConstantRoutes();
 *
 * @param enabled - Whether to enable the query (default: true)
 */
export function useConstantRoutes(enabled = true) {
  return useQuery({
    enabled,
    queryFn: fetchGetConstantRoutes,
    queryKey: QUERY_KEYS.ROUTE.CONSTANT_ROUTES
  });
}

/**
 * Get user routes hook
 *
 * @example
 *   const { data: userRoutes, isLoading } = useUserRoutes();
 *
 * @param enabled - Whether to enable the query (default: true)
 */
export function useUserRoutes(enabled = true) {
  return useQuery({
    enabled,
    gcTime: Infinity,
    queryFn: fetchGetBackendRoutes,
    queryKey: QUERY_KEYS.ROUTE.USER_ROUTES,
    staleTime: Infinity
  });
}

/**
 * Check if route exists hook
 *
 * @example
 *   const { data: exists } = useIsRouteExist('home');
 *
 * @param routeName - Route name to check
 * @param enabled - Whether to enable the query (default: true)
 */
export function useIsRouteExist(routeName: string, enabled = true) {
  return useQuery({
    enabled,
    queryFn: () => fetchIsRouteExist(routeName),
    queryKey: QUERY_KEYS.ROUTE.IS_ROUTE_EXIST(routeName)
  });
}
