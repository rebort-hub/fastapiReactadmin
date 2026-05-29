import {
  mapBackendLoginToken,
  mapBackendUserToAuthInfo,
  type BackendCaptcha,
  type BackendCurrentUser,
  type BackendLoginToken
} from './adapters/auth';
import { request } from '../request';
import { AUTH_URLS } from '../urls';

function buildLoginFormBody(params: Api.Auth.LoginParams) {
  const body = new URLSearchParams();
  body.set('username', params.userName);
  body.set('password', params.password);
  body.set('login_type', params.loginType ?? 'PC端');

  if (params.captcha) {
    body.set('captcha', params.captcha);
  }
  if (params.captchaKey) {
    body.set('captcha_key', params.captchaKey);
  }

  return body;
}

/** 登录 */
export async function fetchLogin(params: Api.Auth.LoginParams) {
  const data = await request<BackendLoginToken>({
    data: buildLoginFormBody(params),
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    method: 'post',
    url: AUTH_URLS.LOGIN
  });

  return mapBackendLoginToken(data);
}

const CAPTCHA_DISABLED: Api.Auth.CaptchaInfo = {
  enable: false,
  imgBase: '',
  key: ''
};

/** 获取验证码；后端未开启验证码服务时返回 enable=false，不阻断登录页 */
export async function fetchGetCaptcha() {
  try {
    const data = await request<BackendCaptcha>({ url: AUTH_URLS.CAPTCHA_GET });

    return {
      enable: data.enable,
      imgBase: data.img_base,
      key: data.key
    } satisfies Api.Auth.CaptchaInfo;
  } catch {
    return CAPTCHA_DISABLED;
  }
}

/** 获取当前用户信息 */
export async function fetchGetUserInfo() {
  const data = await request<BackendCurrentUser>({ url: AUTH_URLS.USER_CURRENT_INFO });
  return mapBackendUserToAuthInfo(data);
}

/** 刷新 token */
export async function fetchRefreshToken(refreshToken: string) {
  const data = await request<BackendLoginToken>({
    data: { refresh_token: refreshToken },
    method: 'post',
    url: AUTH_URLS.REFRESH_TOKEN
  });

  return mapBackendLoginToken(data);
}

/** 退出登录 */
export function fetchLogout(token: string) {
  return request({
    data: { token },
    method: 'post',
    url: AUTH_URLS.LOGOUT
  });
}

/** 用户注册 */
export function fetchRegisterUser(body: Api.Auth.RegisterParams) {
  return request({
    data: {
      password: body.password,
      username: body.username
    },
    method: 'post',
    url: AUTH_URLS.USER_REGISTER
  });
}

/** 忘记密码 */
export function fetchForgetPassword(body: Api.Auth.ForgetPasswordParams) {
  return request({
    data: {
      mobile: body.mobile,
      new_password: body.newPassword,
      username: body.username
    },
    method: 'post',
    url: AUTH_URLS.USER_FORGET_PASSWORD
  });
}

/** OAuth 登录跳转地址 */
export function getOAuthLoginUrl(provider: Api.Auth.OAuthProvider) {
  const apiBase = import.meta.env.DEV && import.meta.env.VITE_HTTP_PROXY === 'Y'
    ? `${window.location.origin}/proxy-default`
    : (import.meta.env.VITE_SERVICE_BASE_URL || '').replace(/\/$/, '');

  const redirectUri = `${window.location.origin}${import.meta.env.VITE_BASE_URL || '/'}`.replace(/\/$/, '') + '/login';

  return `${apiBase}${AUTH_URLS.OAUTH_LOGIN(provider)}?redirect_uri=${encodeURIComponent(redirectUri)}`;
}
