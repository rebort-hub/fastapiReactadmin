import type { RouterNavigateOptions, To } from 'react-router-dom';
import { createBrowserRouter, createHashRouter, matchRoutes } from 'react-router-dom';

import { globalConfig } from '@/config';
import { initCacheRoutes, routes } from '@/router';
import { store } from '@/store';

import { getIsLogin } from '../auth/authStore';

import { initAuthRoutes } from './initRouter';
import { type LocationQueryRaw, stringifyQuery } from './query';
import { setCacheRoutes } from './routeStore';

/**
 * 根据配置创建路由实例
 *
 * 支持 history 和 hash 两种模式，由 globalConfig.routerMode 控制
 */
function createRouterInstance() {
  const routerCreator = globalConfig.routerMode === 'hash' ? createHashRouter : createBrowserRouter;

  return routerCreator;
}

function initRouter() {
  let isAlreadyPatch = false;

  function getIsNeedPatch(path: string) {
    if (!getIsLogin(store.getState())) return false;

    if (isAlreadyPatch) return false;

    const matchRoute = matchRoutes(routes, { pathname: path }, import.meta.env.VITE_BASE_URL);

    if (!matchRoute) return true;

    if (matchRoute) {
      return matchRoute[1].route.path === '*';
    }

    return false;
  }

  const routerCreator = createRouterInstance();

  const reactRouter = routerCreator(routes, {
    basename: import.meta.env.VITE_BASE_URL,
    patchRoutesOnNavigation: async ({ patch, path }) => {
      if (getIsNeedPatch(path)) {
        isAlreadyPatch = true;

        await initAuthRoutes(patch);
      }
    }
  });

  store.dispatch(setCacheRoutes(initCacheRoutes));

  if (getIsLogin(store.getState()) && !isAlreadyPatch) {
    void initAuthRoutes(reactRouter.patchRoutes);
  }

  function resetRoutes() {
    isAlreadyPatch = false;
    reactRouter._internalSetRoutes(routes);
  }

  return {
    reactRouter,
    resetRoutes
  };
}

/** 扩展的导航选项，支持 query 参数 */
type ExtendedNavigateOptions = RouterNavigateOptions & {
  query?: LocationQueryRaw;
};

/** 构建带查询参数的路径 */
function buildPathWithQuery(path: To, query?: LocationQueryRaw): To {
  if (!query) return path;

  const pathStr = typeof path === 'string' ? path : path.pathname || '';
  const search = stringifyQuery(query);

  return `${pathStr}?${search}` as To;
}

function navigator() {
  const { reactRouter, resetRoutes } = initRouter();

  async function navigate(path: To | null, options?: RouterNavigateOptions) {
    reactRouter.navigate(path, options);
  }

  function back() {
    reactRouter.navigate(-1);
  }

  function forward() {
    reactRouter.navigate(1);
  }

  function go(delta: number) {
    reactRouter.navigate(delta);
  }

  /** 替换当前历史记录并导航到新路径 支持完整的 RouterNavigateOptions 和 query 参数 */
  function replace(path: To, options?: ExtendedNavigateOptions) {
    const { query, ...navigateOptions } = options || {};
    const finalPath = buildPathWithQuery(path, query);

    reactRouter.navigate(finalPath, { ...navigateOptions, replace: true });
  }

  function reload() {
    reactRouter.navigate(0);
  }

  function navigateUp() {
    reactRouter.navigate('..');
  }

  function goHome(options?: RouterNavigateOptions) {
    reactRouter.navigate(globalConfig.homePath, options);
  }

  /**
   * 推入新的历史记录并导航到新路径 支持完整的 RouterNavigateOptions 和 query 参数
   *
   * @example
   *   // 基础用法
   *   router.push('/users');
   *
   *   // 带查询参数
   *   router.push('/users', { query: { page: 1, size: 10 } });
   *
   *   // 带状态和选项
   *   router.push('/users', {
   *     query: { page: 1 },
   *     state: { from: 'home' },
   *     preventScrollReset: true
   *   });
   *
   *   // 替换模式（向后兼容）
   *   router.push('/users', { replace: true });
   */
  function push(path: To, options?: ExtendedNavigateOptions) {
    const { query, ...navigateOptions } = options || {};
    const finalPath = buildPathWithQuery(path, query);

    reactRouter.navigate(finalPath, navigateOptions);
  }

  /** 导航到指定路径（navigate 的语义化别名） */
  function goTo(path: To, options?: ExtendedNavigateOptions) {
    const { query, ...navigateOptions } = options || {};
    const finalPath = buildPathWithQuery(path, query);

    reactRouter.navigate(finalPath, navigateOptions);
  }

  /** 获取当前位置信息 */
  function getLocation() {
    return reactRouter.state.location;
  }

  /** 获取当前路径名 */
  function getPathname() {
    return reactRouter.state.location.pathname;
  }

  /** 获取当前查询参数 */
  function getSearch() {
    return reactRouter.state.location.search;
  }

  /** 获取当前 hash */
  function getHash() {
    return reactRouter.state.location.hash;
  }

  /** 获取当前状态 */
  function getState() {
    return reactRouter.state.location.state;
  }

  /** 检查是否可以后退（基于浏览器历史记录） */
  function canGoBack() {
    return window.history.length > 1;
  }

  return {
    back,
    canGoBack,
    forward,
    getHash,
    getLocation,
    getPathname,
    getSearch,
    getState,
    go,
    goHome,
    goTo,
    navigate,
    navigateUp,
    push,
    reactRouter,
    reload,
    replace,
    resetRoutes
  };
}

export const router = navigator();

export type RouterContextType = Awaited<ReturnType<typeof navigator>>;
