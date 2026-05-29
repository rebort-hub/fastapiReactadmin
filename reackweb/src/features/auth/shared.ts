import { localStg } from '@/utils/storage';

/** Get token */
export function getToken() {
  return localStg.get('token') || '';
}

/** Get user info */
export function getUserInfo() {
  const emptyInfo: Api.Auth.UserInfo = {
    buttons: [],
    roles: [],
    userId: '',
    userName: ''
  };
  const userInfo = localStg.get('userInfo') || emptyInfo;

  // fix new property: buttons, this will be removed in the next version `1.1.0`
  if (!userInfo.buttons) {
    userInfo.buttons = [];
  }

  return userInfo;
}

/** Clear auth storage */
export function clearAuthStorage() {
  localStg.remove('token');
  localStg.remove('refreshToken');
  localStg.remove('userInfo');
}

/** 从 access token 解析当前会话 ID（与后端 online 列表 session_id 一致） */
export function getCurrentSessionIdFromToken() {
  const token = getToken().replace(/^Bearer\s+/i, '');
  if (!token) {
    return null;
  }

  try {
    const payload = JSON.parse(atob(token.split('.')[1] ?? '')) as { sub?: string };
    if (!payload.sub) {
      return null;
    }

    const sessionInfo = JSON.parse(payload.sub) as { session_id?: string };
    return sessionInfo.session_id ?? null;
  } catch {
    return null;
  }
}
