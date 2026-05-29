import { globalConfig } from '@/config';
import { fetchGetUserInfo, getOAuthLoginUrl } from '@/service/api/auth';
import { QUERY_KEYS } from '@/service/keys';
import { queryClient } from '@/service/queryClient';
import { localStg } from '@/utils/storage';

import { store } from '@/store';

import { setToken } from './authStore';

/** 跳转第三方 OAuth 登录 */
export function startOAuthLogin(provider: Api.Auth.OAuthProvider) {
  window.location.href = getOAuthLoginUrl(provider);
}

/** 处理 OAuth 回调 query（access_token / refresh_token / oauth_error） */
export async function consumeOAuthCallback(
  searchParams: URLSearchParams,
  onSuccess: () => void,
  onError: (message: string) => void
) {
  const oauthError = searchParams.get('oauth_error');
  const access = searchParams.get('access_token');
  const refresh = searchParams.get('refresh_token');

  if (!oauthError && !(access && refresh)) {
    return false;
  }

  if (oauthError) {
    onError(decodeURIComponent(oauthError));
    return true;
  }

  if (access && refresh) {
    try {
      localStg.set('token', access);
      localStg.set('refreshToken', refresh);

      const userInfo = await fetchGetUserInfo();
      localStg.set('userInfo', userInfo);
      queryClient.setQueryData(QUERY_KEYS.AUTH.USER_INFO, userInfo);

      store.dispatch(setToken(access));
      onSuccess();
    } catch {
      onError('OAuth 登录失败');
    }
  }

  return true;
}

/** 构建 OAuth 回调清理后的登录页路径（去掉 token 相关 query） */
export function buildLoginPathWithoutOAuthQuery(searchParams: URLSearchParams) {
  const next = new URLSearchParams(searchParams);
  ['oauth_error', 'access_token', 'refresh_token', 'token_type'].forEach(key => next.delete(key));

  const basePath = (import.meta.env.VITE_BASE_URL || '/').replace(/\/$/, '');
  const query = next.toString();

  return `${basePath}/login${query ? `?${query}` : ''}`;
}

/** OAuth API 根路径（供调试） */
export function getAuthApiOrigin() {
  return import.meta.env.DEV && import.meta.env.VITE_HTTP_PROXY === 'Y'
    ? `${window.location.origin}/proxy-default`
    : globalConfig.serviceBaseURL.replace(/\/$/, '');
}
