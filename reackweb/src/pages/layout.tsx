import type { RoutePath } from '@soybean-react/vite-plugin-react-router';
import { Outlet, matchRoutes } from 'react-router-dom';

import { usePrevious, useRoute } from '@/features/router';
import { allRoutes } from '@/router';
import { fetchGetUserInfo } from '@/service/api/auth.ts';
import { isAuthSessionError } from '@/service/request/auth-error';
import { useUserInfo } from '@/service/hooks';
import { QUERY_KEYS } from '@/service/keys/index.ts';
import { queryClient } from '@/service/queryClient';
import { localStg } from '@/utils/storage';

function handleRouteSwitch(to: Router.Route, from: Router.Route | null) {
  // route with href
  if (to.handle.href) {
    window.open(to.handle.href, '_blank');

    return { path: from?.fullPath as string, replace: true };
  }

  return null;
}

// eslint-disable-next-line max-params
function createRouteGuard(to: Router.Route, roles: string[], isSuper: boolean, previousRoute: Router.Route | null) {
  const loginRoute: RoutePath = '/login';

  const isLogin = Boolean(localStg.get('token'));

  const notFoundRoute = 'notFound';

  const isNotFoundRoute = to.id === notFoundRoute;

  if (!isLogin) {
    // if the user is not logged in and the route is a constant route but not the "not-found" route, then it is allowed to access.
    if (to.handle.constant && !isNotFoundRoute) {
      return null;
    }

    // if the user is not logged in, then switch to the login page

    const query = to.fullPath;

    const location = `${loginRoute}?redirect=${query}`;

    return location;
  }

  const rootRoute: RoutePath = '/';
  const noAuthorizationRoute: RoutePath = '/403';

  const needLogin = !to.handle.constant;
  const routeRoles = to.handle.roles || [];

  const hasRole = roles.some(role => routeRoles.includes(role));

  const hasAuth = isSuper || !routeRoles.length || hasRole;

  // if it is login route when logged in, then switch to the root page
  if (to.fullPath.includes('login') && to.pathname !== '/login-out' && isLogin) {
    return rootRoute;
  }

  if (to.id === 'notFound') {
    // 动态路由：未 patch 的页面会暂时落到 notFound，不应误判为 403
    if (import.meta.env.VITE_AUTH_ROUTE_MODE === 'static') {
      const exist = matchRoutes(allRoutes[0].children || [], to.pathname);

      if (exist && exist.length > 1) {
        return noAuthorizationRoute;
      }
    }

    return null;
  }

  if (!needLogin) return handleRouteSwitch(to, previousRoute);

  // if the user is logged in but does not have authorization, then switch to the 403 page
  if (!hasAuth && import.meta.env.VITE_AUTH_ROUTE_MODE === 'static') return noAuthorizationRoute;

  return handleRouteSwitch(to, previousRoute);
}

const RootLayout = () => {
  const route = useRoute();

  const previousRoute = usePrevious(route);

  const { handle, id, pathname } = route;

  const routeId = useRef<string>(null);

  const location = useRef<string | { path: string; replace: boolean } | null>(null);

  const { i18nKey, title } = handle;

  const { data: userInfo } = useUserInfo();

  const roles = userInfo?.roles || [];

  const isSuper = userInfo?.roles.includes(import.meta.env.VITE_STATIC_SUPER_ROLE);

  const { t } = useTranslation();

  useEffect(() => {
    document.title = i18nKey ? t(i18nKey) : title;
  }, [i18nKey, title, t]);

  useEffect(() => {
    window.NProgress?.done?.();

    return () => {
      window.NProgress?.start?.();
    };
  }, [pathname]);

  if (routeId.current !== id) {
    routeId.current = id;

    location.current = createRouteGuard(route, roles, isSuper || false, previousRoute);
  }

  // eslint-disable-next-line no-nested-ternary
  return location.current ? (
    typeof location.current === 'string' ? (
      <Navigate to={location.current} />
    ) : (
      <Navigate
        replace={location.current.replace}
        to={location.current.path}
      />
    )
  ) : (
    <Outlet context={previousRoute} />
  );
};

export async function loader() {
  const hasToken = Boolean(localStg.get('token'));

  if (!hasToken) {
    return;
  }

  try {
    await queryClient.prefetchQuery({
      gcTime: Infinity,
      queryFn: fetchGetUserInfo,
      queryKey: QUERY_KEYS.AUTH.USER_INFO,
      retry: false,
      staleTime: Infinity
    });
  } catch (error) {
    if (isAuthSessionError(error)) {
      const { resetAuth } = await import('@/features/auth/auth');
      resetAuth();
    }
  }
}

export default RootLayout;
