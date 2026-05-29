/** 后端认证 / 用户信息与前端 Api.Auth 结构映射 */

type BackendRole = {
  code?: string;
  menus?: BackendMenu[];
};

type BackendMenu = {
  children?: BackendMenu[];
  permission?: string | null;
};

export type BackendCurrentUser = {
  id?: number;
  is_superuser?: boolean;
  menus?: BackendMenu[];
  name?: string;
  roles?: BackendRole[];
  username?: string;
};

export type BackendLoginToken = {
  access_token: string;
  refresh_token: string;
};

export type BackendCaptcha = {
  enable: boolean;
  img_base: string;
  key: string;
};

function collectPermissions(menus: BackendMenu[]): string[] {
  const set = new Set<string>();

  function walk(items: BackendMenu[]) {
    items.forEach(item => {
      if (item.permission) {
        set.add(item.permission);
      }
      if (item.children?.length) {
        walk(item.children);
      }
    });
  }

  walk(menus);
  return [...set];
}

function collectRoleMenuPermissions(roles: BackendRole[] | undefined): string[] {
  const menus = (roles ?? []).flatMap(role => role.menus ?? []);
  return collectPermissions(menus);
}

export function mapBackendLoginToken(data: BackendLoginToken): Api.Auth.LoginToken {
  return {
    refreshToken: data.refresh_token,
    token: data.access_token
  };
}

export function mapBackendUserToAuthInfo(data: BackendCurrentUser): Api.Auth.UserInfo {
  const menus = data.menus ?? [];
  const roleMenus = collectRoleMenuPermissions(data.roles);
  const buttons = [...new Set([...collectPermissions(menus), ...roleMenus])];

  const superRole = import.meta.env.VITE_STATIC_SUPER_ROLE;
  const roles = data.is_superuser
    ? [superRole]
    : [...new Set((data.roles ?? []).map(role => role.code).filter((code): code is string => Boolean(code)))];

  return {
    buttons,
    roles,
    userId: String(data.id ?? ''),
    userName: data.name || data.username || ''
  };
}
