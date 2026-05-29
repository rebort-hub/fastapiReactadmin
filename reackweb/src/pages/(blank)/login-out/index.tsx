import { resetAuth } from '@/features/auth';

const LoginOut = () => {
  return null;
};

/** 先清理本地会话再跳转登录，避免退出接口在 token 失效时触发 refresh 死锁 */
export const loader = async () => {
  resetAuth();
  return null;
};

export default LoginOut;
