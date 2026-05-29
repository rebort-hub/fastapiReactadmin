/** 认证授权 API（对接 FastAPI /api/v1） */

const API_PREFIX = '/api/v1';

export const AUTH_URLS = {
  CAPTCHA_GET: `${API_PREFIX}/system/auth/captcha/get`,
  LOGIN: `${API_PREFIX}/system/auth/login`,
  LOGOUT: `${API_PREFIX}/system/auth/logout`,
  REFRESH_TOKEN: `${API_PREFIX}/system/auth/token/refresh`,
  OAUTH_LOGIN: (provider: string) => `${API_PREFIX}/system/auth/oauth/${provider}/login`,
  USER_CURRENT_INFO: `${API_PREFIX}/system/user/current/info`,
  USER_REGISTER: `${API_PREFIX}/system/user/register`,
  USER_FORGET_PASSWORD: `${API_PREFIX}/system/user/forget/password`
} as const;
