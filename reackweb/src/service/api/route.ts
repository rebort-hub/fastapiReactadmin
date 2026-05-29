import { adaptMenusToBackendRoutes } from './adapters/menu-route';
import { fetchGetCurrentUserProfile } from './user';
import { request } from '../request';
import { ROUTE_URLS } from '../urls';

/** get constant routes */
export function fetchGetConstantRoutes() {
  return request<Api.Route.MenuRoute[]>({ url: ROUTE_URLS.GET_CONSTANT_ROUTES });
}

/**
 * 动态路由：从当前用户接口读取菜单树并转换为 React 路由结构
 * （对接 FastAPI `/system/user/current/info`，不再请求不存在的 `/route/getReactUserRoutes`）
 */
export async function fetchGetBackendRoutes() {
  const profile = await fetchGetCurrentUserProfile();
  return adaptMenusToBackendRoutes(profile.menus ?? []);
}

/** get user routes */
export function fetchGetVueUserRoutes() {
  return request<Api.Route.UserRoute>({ url: '/route/getUserRoutes' });
}

/**
 * whether the route is exist
 *
 * @param routeName route name
 */
export function fetchIsRouteExist(routeName: string) {
  return request<boolean>({ params: { routeName }, url: ROUTE_URLS.IS_ROUTE_EXIST });
}
