import type { RequestInstance } from '@sa/axios';
import { BACKEND_ERROR_CODE } from '@sa/axios';
import type { AxiosError, AxiosInstance, AxiosResponse } from 'axios';

import { $t } from '@/locales';

import {
  failRefreshAndLogout,
  getAuthorization,
  handleExpiredRequest,
  isRefreshTokenRequest,
  redirectToLoginOut,
  showErrorMsg
} from './shared';
import type { RequestInstanceState } from './type';

/** - 后端错误处理 */
export async function backEndFail(
  response: AxiosResponse<App.Service.Response<unknown>, any>,
  instance: AxiosInstance,
  request: RequestInstance<RequestInstanceState>
) {
  const responseCode = String(response.data.code);

  function handleLogout() {
    redirectToLoginOut();
  }

  function logoutAndCleanup() {
    handleLogout();
    window.removeEventListener('beforeunload', handleLogout);

    request.state.errMsgStack = (request.state.errMsgStack ?? []).filter(msg => msg !== response.data.msg);
  }

  // refresh 接口失败时不得再走 refresh 逻辑，否则会与 handleRefreshToken 互相等待导致死锁
  if (isRefreshTokenRequest(response.config)) {
    failRefreshAndLogout(request.state);
    return null;
  }

  const logoutCodes =
    import.meta.env.VITE_SERVICE_LOGOUT_CODES?.split(',').map(s => s.trim()).filter(Boolean) || [];
  if (logoutCodes.includes(responseCode)) {
    handleLogout();
    return null;
  }

  const modalLogoutCodes = import.meta.env.VITE_SERVICE_MODAL_LOGOUT_CODES?.split(',') || [];
  if (modalLogoutCodes.includes(responseCode) && !(request.state.errMsgStack ?? []).includes(response.data.msg)) {
    request.state.errMsgStack = [...(request.state.errMsgStack ?? []), response.data.msg];

    window.addEventListener('beforeunload', handleLogout);

    window.$modal?.error({
      content: response.data.msg,
      keyboard: false,
      maskClosable: false,
      okText: $t('common.confirm'),
      onClose() {
        logoutAndCleanup();
      },
      onOk() {
        logoutAndCleanup();
      },
      title: $t('common.error')
    });

    return null;
  }

  const expiredTokenCodes =
    import.meta.env.VITE_SERVICE_EXPIRED_TOKEN_CODES?.split(',').map(s => s.trim()).filter(Boolean) || [];
  const isUnauthorized = response.status === 401;
  if (expiredTokenCodes.includes(responseCode) || isUnauthorized) {
    const success = await handleExpiredRequest(request.state);
    if (success) {
      const Authorization = getAuthorization();
      Object.assign(response.config.headers, { Authorization });

      return instance.request(response.config) as Promise<AxiosResponse>;
    }

    failRefreshAndLogout(request.state);
    return null;
  }

  return null;
}

/** - 网络错误处理 */
export async function handleError(
  error: AxiosError<App.Service.Response<unknown>, any>,
  request: RequestInstance<RequestInstanceState>
) {
  let message = error.message;
  let backendErrorCode = '';

  const responseData = error.response?.data;
  const httpStatus = error.response?.status;

  if (responseData && typeof responseData === 'object' && 'msg' in responseData && responseData.msg) {
    message = String(responseData.msg);
    backendErrorCode = String(responseData.code ?? '');
  } else if (error.code === BACKEND_ERROR_CODE) {
    message = error.response?.data?.msg || message;
    backendErrorCode = String(error.response?.data?.code || '');
  }

  if (isRefreshTokenRequest(error.config)) {
    failRefreshAndLogout(request.state);
    return;
  }

  const logoutCodes =
    import.meta.env.VITE_SERVICE_LOGOUT_CODES?.split(',').map(s => s.trim()).filter(Boolean) || [];
  if (logoutCodes.includes(backendErrorCode)) {
    redirectToLoginOut();
    return;
  }

  const modalLogoutCodes = import.meta.env.VITE_SERVICE_MODAL_LOGOUT_CODES?.split(',') || [];
  if (modalLogoutCodes.includes(backendErrorCode)) {
    return;
  }

  const expiredTokenCodes =
    import.meta.env.VITE_SERVICE_EXPIRED_TOKEN_CODES?.split(',').map(s => s.trim()).filter(Boolean) ||
    [];
  const isTokenExpired = expiredTokenCodes.includes(backendErrorCode) || httpStatus === 401;

  if (isTokenExpired) {
    const refreshed = await handleExpiredRequest(request.state);
    if (!refreshed) {
      failRefreshAndLogout(request.state);
    }
    return;
  }

  showErrorMsg(request.state, message);
}
