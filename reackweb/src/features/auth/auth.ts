import { useLoading } from '@sa/hooks';

import { globalConfig } from '@/config';
import { getIsLogin } from '@/features/auth/authStore';
import { router, useRouter } from '@/features/router';
import { useLogin, useUserInfo } from '@/service/hooks';
import { QUERY_KEYS } from '@/service/keys';
import { queryClient } from '@/service/queryClient';
import { store } from '@/store';
import { localStg } from '@/utils/storage';

import { resetRouteStore } from '../router/routeStore';
import { clearTabs, selectTabs } from '../tab/tabStore';
import { getThemeSettings } from '../theme/themeSettingsStore';

import { resetAuth as resetAuthAction, setToken } from './authStore';
import { clearAuthStorage, getUserInfo } from './shared';

const { VITE_AUTH_ROUTE_MODE, VITE_STATIC_SUPER_ROLE } = import.meta.env;

export function useAuth() {
  const { data } = useUserInfo();

  const isLogin = useAppSelector(getIsLogin);

  const isStaticSuper = VITE_AUTH_ROUTE_MODE === 'static' && data?.roles.includes(VITE_STATIC_SUPER_ROLE);

  const isSuper = Boolean(data?.roles.includes(VITE_STATIC_SUPER_ROLE));

  function hasAuth(codes: string | string[]) {
    if (!isLogin || !data) {
      return false;
    }

    if (isSuper) {
      return true;
    }

    if (typeof codes === 'string') {
      return data.buttons.includes(codes);
    }

    return codes.some(code => data.buttons.includes(code));
  }

  return {
    hasAuth,
    isStaticSuper,
    isSuper
  };
}

export function useInitAuth() {
  const { endLoading, loading, startLoading } = useLoading();

  const [searchParams] = useSearchParams();

  const { mutate: login } = useLogin();

  const { refetch: refetchUserInfo } = useUserInfo();

  const { t } = useTranslation();

  const dispatch = useAppDispatch();

  const { replace } = useRouter();

  const redirectUrl = searchParams.get('redirect');

  async function toLogin(params: Api.Auth.LoginParams, redirect = true) {
    if (loading) return;

    startLoading();

    login(params, {
      onError: error => {
        endLoading();
        console.error(error);
      },
      onSuccess: async data => {
        localStg.set('token', data.token);

        localStg.set('refreshToken', data.refreshToken);

        const { data: info, error } = await refetchUserInfo();

        if (!error && info) {
          const previousUserId = localStg.get('previousUserId');

          localStg.set('userInfo', info);

          dispatch(setToken(data.token));

          if (previousUserId !== info.userId || !previousUserId) {
            localStg.remove('globalTabs');

            replace(globalConfig.homePath);
          } else if (redirect) {
            if (redirectUrl) {
              replace(redirectUrl);
            } else {
              replace(globalConfig.homePath);
            }
          }

          window.$notification?.success({
            description: t('page.login.common.welcomeBack', { userName: info.userName }),
            message: t('page.login.common.loginSuccess')
          });
        } else {
          endLoading();
        }
      }
    });
  }

  return {
    loading,
    toLogin
  };
}

/**
 * Reset auth - 重置认证状态（可直接调用的函数版本）
 *
 * 清除认证信息、标签页、路由缓存，并跳转到登录页
 */
export function resetAuth() {
  // 清除认证存储
  clearAuthStorage();

  // 重置认证状态
  store.dispatch(resetAuthAction());

  // 清除标签页
  store.dispatch(clearTabs());

  // 重置路由存储
  store.dispatch(resetRouteStore());

  // 获取用户信息（从缓存或 localStorage）
  const userInfo = queryClient.getQueryData<Api.Auth.UserInfo>(QUERY_KEYS.AUTH.USER_INFO) || getUserInfo();

  // 保存上一个用户 ID
  localStg.set('previousUserId', userInfo?.userId || '');

  // 重置路由
  router.resetRoutes();

  // 缓存标签页（如果启用）
  const themeSettings = getThemeSettings(store.getState());
  const tabs = selectTabs(store.getState());
  if (themeSettings.tab.cache) {
    localStg.set('globalTabs', tabs);
  }

  // 清除查询缓存
  queryClient.clear();

  const location = router.reactRouter.state.location;

  const fullPath = location.pathname + location.search + location.hash;
  // 获取当前路径
  const currentPath = location.pathname + location.search;
  const isLoginPage = currentPath.includes('/login');

  // 如果不是登录页，跳转到登录页并带上 redirect 参数
  if (!isLoginPage) {
    router.push('/login', { query: { redirect: fullPath }, replace: true });
  } else {
    router.replace('/login');
  }
}
