import type { ReactNode } from 'react';

import { useAuth } from '@/features/auth';

type Props = {
  /** 后端菜单按钮 permission，未传则始终渲染 */
  perm?: string | string[];
  children: ReactNode;
};

/** 按当前用户 buttons 权限控制子节点显示 */
const Auth = ({ children, perm }: Props) => {
  const { hasAuth } = useAuth();

  if (perm && !hasAuth(perm)) {
    return null;
  }

  return children;
};

export default Auth;
