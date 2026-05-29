/**
 * React Query Keys
 *
 * Global unique keys for React Query cache management
 */

export const QUERY_KEYS = {
  // Auth
  AUTH: {
    USER_INFO: ['auth', 'userInfo'] as const
  },
  USER_CENTER: {
    PROFILE: ['userCenter', 'profile'] as const
  },
  HOME: {
    LOG_TREND: ['home', 'logTrend'] as const,
    NOTICES: ['home', 'notices'] as const,
    OVERVIEW: ['home', 'overview'] as const
  },
  NOTICE: {
    AVAILABLE: ['notice', 'available'] as const
  },
  // Route
  ROUTE: {
    CONSTANT_ROUTES: ['route', 'constantRoutes'] as const,
    IS_ROUTE_EXIST: (routeName: string) => ['route', 'isRouteExist', routeName] as const,
    USER_ROUTES: ['route', 'userRoutes'] as const
  },
  // System Manage
  SYSTEM_MANAGE: {
    ALL_PAGES: ['systemManage', 'allPages'] as const,
    ALL_ROLES: ['systemManage', 'allRoles'] as const,
    MENU_LIST: ['systemManage', 'menuList'] as const,
    MENU_TREE: ['systemManage', 'menuTree'] as const,
    ROLE_LIST: (params?: Api.SystemManage.RoleSearchParams) => ['systemManage', 'roleList', params] as const,
    USER_LIST: (params?: Api.SystemModule.UserSearchParams) => ['systemManage', 'userList', params] as const
  }
} as const;

export const MUTATION_KEYS = {
  AUTH: {
    LOGIN: ['auth', 'login'] as const,
    REFRESH_TOKEN: ['auth', 'refreshToken'] as const
  }
} as const;
