import { useQuery } from '@tanstack/react-query';

import {
  fetchGetAllPages,
  fetchGetAllRoles,
  fetchGetMenuList,
  fetchGetMenuTree,
  fetchGetPositionOptions,
  fetchGetRoleList,
  fetchGetRoleOptions,
  fetchGetUserList
} from '../api';
import { QUERY_KEYS } from '../keys';

/**
 * Get role list hook
 *
 * @example
 *   const { data: roleList, isLoading } = useRoleList({ current: 1, size: 10 });
 *
 * @param params - Search parameters
 */
export function useRoleList(params?: Api.SystemManage.RoleSearchParams) {
  return useQuery({
    queryFn: () => fetchGetRoleList(params),
    queryKey: QUERY_KEYS.SYSTEM_MANAGE.ROLE_LIST(params)
  });
}

/**
 * Get all roles hook
 *
 * @example
 *   const { data: allRoles, isLoading } = useAllRoles();
 */
export function useAllRoles() {
  return useQuery({
    queryFn: fetchGetAllRoles,
    queryKey: QUERY_KEYS.SYSTEM_MANAGE.ALL_ROLES,
    staleTime: 0
  });
}

/**
 * Get user list hook
 *
 * @example
 *   const { data: userList, isLoading } = useUserList({ current: 1, size: 10 });
 *
 * @param params - Search parameters
 */
export function useUserList(params?: Api.SystemModule.UserSearchParams) {
  return useQuery({
    queryFn: () => fetchGetUserList(params),
    queryKey: QUERY_KEYS.SYSTEM_MANAGE.USER_LIST(params)
  });
}

/** 角色下拉（对接后端） */
export function useRoleOptions() {
  return useQuery({
    queryFn: fetchGetRoleOptions,
    queryKey: ['systemModule', 'roleOptions'] as const,
    staleTime: 60_000
  });
}

/** 岗位下拉（对接后端） */
export function usePositionOptions() {
  return useQuery({
    queryFn: fetchGetPositionOptions,
    queryKey: ['systemModule', 'positionOptions'] as const,
    staleTime: 60_000
  });
}

/**
 * Get menu list hook
 *
 * @example
 *   const { data: menuList, isLoading } = useMenuList();
 */
export function useMenuList() {
  return useQuery({
    queryFn: fetchGetMenuList,
    queryKey: QUERY_KEYS.SYSTEM_MANAGE.MENU_LIST
  });
}

/**
 * Get all pages hook
 *
 * @example
 *   const { data: allPages, isLoading } = useAllPages();
 */
export function useAllPages() {
  return useQuery({
    queryFn: fetchGetAllPages,
    queryKey: QUERY_KEYS.SYSTEM_MANAGE.ALL_PAGES,
    staleTime: 0
  });
}

/**
 * Get menu tree hook
 *
 * @example
 *   const { data: menuTree, isLoading } = useMenuTree();
 */
export function useMenuTree() {
  return useQuery({
    queryFn: () => fetchGetMenuTree({ status: '0' }),
    queryKey: QUERY_KEYS.SYSTEM_MANAGE.MENU_TREE
  });
}
