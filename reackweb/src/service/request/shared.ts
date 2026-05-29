import type { InternalAxiosRequestConfig } from 'axios';

import { localStg } from '@/utils/storage';

import { fetchRefreshToken } from '../api';

import type { RequestInstanceState } from './type';

const REFRESH_TOKEN_PATH = '/system/auth/token/refresh';

export function isRefreshTokenRequest(config?: InternalAxiosRequestConfig) {
  const url = config?.url ?? '';
  return url.includes(REFRESH_TOKEN_PATH);
}

export function getAuthorization() {
  const token = localStg.get('token');
  const Authorization = token ? `Bearer ${token}` : null;

  return Authorization;
}

/** 清理本地会话并跳转登录（不调用退出接口，避免 token 失效时 refresh 死锁） */
export async function redirectToLoginOut() {
  const { resetAuth } = await import('@/features/auth/auth');
  resetAuth();
}

/** 刷新失败时解除等待中的并发请求，并跳转退出 */
export function failRefreshAndLogout(state: RequestInstanceState) {
  state.refreshTokenFn = Promise.resolve(false);
  redirectToLoginOut();
}

/**
 * refresh token
 *
 * @param axiosConfig - request config when the token is expired
 */
export async function handleRefreshToken() {
  const refreshToken = localStg.get('refreshToken') || '';

  if (!refreshToken) {
    redirectToLoginOut();
    return false;
  }

  try {
    const data = await fetchRefreshToken(refreshToken);
    localStg.set('token', data.token);
    localStg.set('refreshToken', data.refreshToken);
    return true;
  } catch {
    redirectToLoginOut();
    return false;
  }
}

export async function handleExpiredRequest(state: RequestInstanceState) {
  if (!state.refreshTokenFn) {
    state.refreshTokenFn = handleRefreshToken().finally(() => {
      setTimeout(() => {
        state.refreshTokenFn = null;
      }, 1000);
    });
  }

  return state.refreshTokenFn;
}

export function showErrorMsg(state: RequestInstanceState, message: string) {
  if (!state.errMsgStack?.length) {
    state.errMsgStack = [];
  }

  const isExist = state.errMsgStack.includes(message);

  if (!isExist) {
    state.errMsgStack.push(message);

    window.$message?.error({
      content: message,
      onClose: () => {
        state.errMsgStack = state.errMsgStack.filter(msg => msg !== message);

        setTimeout(() => {
          state.errMsgStack = [];
        }, 5000);
      }
    });
  }
}
