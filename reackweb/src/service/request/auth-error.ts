import type { AxiosError } from 'axios';

const EXPIRED_TOKEN_CODES =
  import.meta.env.VITE_SERVICE_EXPIRED_TOKEN_CODES?.split(',').map(s => s.trim()).filter(Boolean) || [];

const LOGOUT_CODES =
  import.meta.env.VITE_SERVICE_LOGOUT_CODES?.split(',').map(s => s.trim()).filter(Boolean) || [];

function getBackendCode(error: unknown) {
  if (!error || typeof error !== 'object' || !('response' in error)) {
    return '';
  }

  const data = (error as AxiosError<App.Service.Response<unknown>>).response?.data;
  if (data && typeof data === 'object' && 'code' in data) {
    return String(data.code ?? '');
  }

  return '';
}

/** 是否为认证失效（应登出/刷新），不含无权限 10403 */
export function isAuthSessionError(error: unknown) {
  const code = getBackendCode(error);
  const status = (error as AxiosError)?.response?.status;

  if (LOGOUT_CODES.includes(code) || EXPIRED_TOKEN_CODES.includes(code)) {
    return true;
  }

  return status === 401;
}
