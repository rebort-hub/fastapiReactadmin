import type { ElegantConstRoute } from '@soybean-react/vite-plugin-react-router';

import { generatedRoutes } from '@/router/elegant/routes';
import { pages } from '@/router/elegant/imports';

type BackendMenuItem = Api.SystemModule.BackendMenu;

const pageKeys = new Set(Object.keys(pages));

/** 从优雅路由静态表构建 path → routeName 索引（兜底） */
function buildPathToRouteNameMap() {
  const map = new Map<string, string>();

  function walk(nodes: ElegantConstRoute[], parentPath = '') {
    nodes.forEach(node => {
      if (!node.path || !node.name) {
        return;
      }

      const segment = node.path.startsWith('/') ? node.path : `/${node.path}`;
      const fullPath =
        node.path.startsWith('/') || !parentPath
          ? segment
          : `${parentPath.replace(/\/$/, '')}${segment}`.replace(/\/+/g, '/');

      map.set(fullPath, node.name);

      if (node.children?.length) {
        walk(node.children, fullPath);
      }
    });
  }

  const baseGroup = generatedRoutes[0]?.children?.find(item => item.name === '(base)');
  if (baseGroup?.children?.length) {
    walk(baseGroup.children);
  }

  return map;
}

const pathToRouteName = buildPathToRouteNameMap();

function resolvePageKey(menu: BackendMenuItem, fullPath: string) {
  const candidates = [menu.route_name, menu.component_path].filter(Boolean) as string[];
  for (const key of candidates) {
    if (pageKeys.has(key)) {
      return key;
    }
  }
  return pathToRouteName.get(fullPath) ?? null;
}

function normalizePath(routePath: string | null | undefined, parentFullPath: string) {
  const raw = (routePath ?? '').trim();
  if (!raw) {
    return parentFullPath;
  }

  if (/^https?:\/\//i.test(raw)) {
    return raw;
  }

  if (raw.startsWith('/')) {
    return raw.replace(/\/+/g, '/');
  }

  const base = parentFullPath.replace(/\/$/, '');
  return `${base}/${raw.replace(/^\/+/, '')}`.replace(/\/+/g, '/');
}

function buildHandle(menu: BackendMenuItem): Router.RouteHandle {
  const routeKey = menu.route_name ? `route.${menu.route_name}` : undefined;

  return {
    hideInMenu: menu.hidden ?? false,
    i18nKey: routeKey,
    icon: menu.icon ?? undefined,
    keepAlive: menu.keep_alive ?? true,
    order: menu.order,
    title: menu.title ?? menu.name
  };
}

function adaptMenuNode(menu: BackendMenuItem, parentFullPath = ''): Api.Route.BackendRoute | null {
  if (menu.type === 3 || menu.status === '1') {
    return null;
  }

  const fullPath = normalizePath(menu.route_path, parentFullPath);
  const children =
    menu.children
      ?.map(child => adaptMenuNode(child, fullPath))
      .filter((item): item is Api.Route.BackendRoute => item !== null) ?? [];

  const pageKey = resolvePageKey(menu, fullPath);
  const isDirectory = menu.type === 1;

  const routeName = menu.route_name || pageKey || `menu_dir_${menu.id ?? menu.name}`;

  if (isDirectory) {
    if (!children.length && !menu.redirect) {
      return null;
    }

    return {
      children: children.length ? children : undefined,
      component: pageKey ?? undefined,
      handle: buildHandle(menu),
      name: routeName,
      path: fullPath || `/${menu.route_name ?? menu.id}`,
      redirect: menu.redirect ?? undefined
    };
  }

  if (!pageKey) {
    return children.length ? { children, handle: buildHandle(menu), name: routeName, path: fullPath } : null;
  }

  return {
    children: children.length ? children : undefined,
    component: pageKey,
    handle: buildHandle(menu),
    name: routeName,
    path: fullPath,
    redirect: menu.redirect ?? undefined
  };
}

function findFirstNavigablePath(routes: Api.Route.BackendRoute[]): string | null {
  for (const route of routes) {
    if (route.component && route.path) {
      return route.path;
    }
    if (route.children?.length) {
      const nested = findFirstNavigablePath(route.children);
      if (nested) {
        return nested;
      }
    }
  }
  return null;
}

/** 将后端菜单树转为 React 动态路由结构（种子数据已与优雅路由对齐） */
export function adaptMenusToBackendRoutes(menus: BackendMenuItem[]): Api.Route.BackendRouteResponse {
  const routes = menus
    .map(menu => adaptMenuNode(menu, ''))
    .filter((item): item is Api.Route.BackendRoute => item !== null);

  const defaultHome = import.meta.env.VITE_ROUTE_HOME || '/home';
  const firstPath = findFirstNavigablePath(routes) ?? defaultHome;

  return {
    home: firstPath as Api.Route.BackendRouteResponse['home'],
    routes
  };
}
