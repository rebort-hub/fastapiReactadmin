import type { RouteObject } from 'react-router-dom';

import { authRoutes } from '@/router';
import { fetchGetBackendRoutes, fetchGetUserInfo } from '@/service/api';
import { isAuthSessionError } from '@/service/request/auth-error';
import { globalConfig } from '@/config';
import { QUERY_KEYS } from '@/service/keys';
import { queryClient } from '@/service/queryClient';
import { store } from '@/store';

import { setCacheRoutes, setHomePath } from './routeStore';
import {
  collectBackendRoutePaths,
  filterAuthRoutesByRoles,
  getHiddenAuthRoutePatches,
  getStandaloneHiddenRoutePatches,
  mergeValuesByParent,
  transformBackendRoutesToReactRoutes
} from './shared';

export async function initAuthRoutes(addRoutes: (parent: string | null, route: RouteObject[]) => void) {
  const authRouteMode = import.meta.env.VITE_AUTH_ROUTE_MODE;

  const reactAuthRoutes = mergeValuesByParent(authRoutes);

  let userInfo: Api.Auth.UserInfo | undefined;

  try {
    userInfo = await queryClient.ensureQueryData<Api.Auth.UserInfo>({
      queryFn: fetchGetUserInfo,
      queryKey: QUERY_KEYS.AUTH.USER_INFO,
      retry: false
    });
  } catch (error) {
    if (isAuthSessionError(error)) {
      const { resetAuth } = await import('@/features/auth/auth');
      resetAuth();
    }
  }

  if (!userInfo) {
    return;
  }

  const isSuper = userInfo?.roles.includes(import.meta.env.VITE_STATIC_SUPER_ROLE);

  // 静态模式
  if (authRouteMode === 'static') {
    // 超级管理员
    if (isSuper) {
      reactAuthRoutes.forEach(route => {
        addRoutes(route.parent, route.route);
      });
    } else {
      // 非超级管理员
      const filteredRoutes = filterAuthRoutesByRoles(reactAuthRoutes, userInfo?.roles || []);

      filteredRoutes.forEach(({ parent, route }) => {
        addRoutes(parent, route);
      });
    }
  } else {
    // 动态模式
    try {
      const data = await queryClient.ensureQueryData<Api.Route.BackendRouteResponse>({
        gcTime: Infinity,
        queryFn: fetchGetBackendRoutes,
        queryKey: QUERY_KEYS.ROUTE.USER_ROUTES,
        staleTime: Infinity
      });

      store.dispatch(setHomePath(data.home || globalConfig.homePath));

      if (!data.routes.length) {
        window.$message?.warning('当前账号未分配可访问的菜单，请联系管理员');
        return;
      }

      const routeParentMap = new Map<string, string | null>();

      function collectParentInfo(routes: Api.Route.BackendRoute[], parent: string | null = null) {
        routes.forEach(route => {
          const routeParent = route.layout !== undefined ? route.layout : parent;
          routeParentMap.set(route.name, routeParent ?? null);
          if (route.children?.length) {
            collectParentInfo(route.children, route.name);
          }
        });
      }

      collectParentInfo(data.routes, '(base)');

      // 将后端路由结构转换为 React Router 路由结构
      const { cacheRoutes, routes: reactRoutes } = transformBackendRoutesToReactRoutes(data.routes);

      // 设置缓存路由
      if (cacheRoutes.length > 0) {
        store.dispatch(setCacheRoutes(cacheRoutes));
      }

      reactRoutes.forEach(routeArray => {
        const parent = routeParentMap.get(routeArray.id as string);
        if (parent) {
          addRoutes(parent, [routeArray]);
        } else {
          addRoutes(null, [routeArray]);
        }
      });

      const allowedPaths = collectBackendRoutePaths(data.routes);
      getHiddenAuthRoutePatches(authRoutes, allowedPaths).forEach(({ parent, route: hiddenRoute }) => {
        addRoutes(parent, [hiddenRoute]);
      });
      getStandaloneHiddenRoutePatches(authRoutes).forEach(({ parent, route: hiddenRoute }) => {
        addRoutes(parent, [hiddenRoute]);
      });
    } catch (error) {
      console.error('Failed to initialize auth routes:', error);
      if (isAuthSessionError(error)) {
        const { resetAuth } = await import('@/features/auth/auth');
        resetAuth();
        return;
      }
      window.$message?.error('路由初始化失败，请刷新页面重试');
    }
  }
}
